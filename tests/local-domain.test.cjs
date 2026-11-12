'use strict';
/* Pruebas de dominio: no se conecta a servidores, dinero ni datos reales. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const map=new Map();
const storage={
 getItem:k=>map.get(k)??null,
 setItem:(k,v)=>map.set(k,String(v)),
 removeItem:k=>map.delete(k)
};
const window={localStorage:storage,dispatchEvent:()=>{}};
const sandbox={window,localStorage:storage,console,Date,Math,JSON,Number,String,Array,Error,Set,Map};
vm.runInNewContext(fs.readFileSync('shared/iq-commerce-local-bridge.js','utf8'),sandbox);
const engine=window.IQCommerceDemo;
const seed={
 products:[{id:'P1',name:'Producto A',price:100,stock:3,category:'c1',active:true,code:'SK1',images:[]}],
 categories:[{id:'c1',name:'Perfumes',active:true}],orders:[],customers:[],returns:[],
 tax:{ivaEnabled:false,ivaRate:16},shipping:{standard:99},coupons:[],content:[]
};
let db=engine.boot(seed);
assert.equal(db.products.length,1);
assert.equal(engine.available(db,'P1'),3);
let paymentBefore=false;
try{engine.tx(d=>engine.confirmPayment(d,'does-not-exist'))}catch(e){paymentBefore=true}
assert(paymentBefore);
const created=engine.tx(d=>engine.createOrder(d,{
 customer:{name:'Client One',email:'first@example.test'},items:[{productId:'P1',qty:2}],
 shippingTotal:99,paymentMethod:'transferencia'})).value;
assert.equal(created.items[0].unitPrice,100);
assert.equal(created.items[0].lineTotal,200);
assert.equal(created.total,299);
db=engine.get();
assert.equal(engine.available(db,'P1'),1);
assert.equal(db.products[0].stock,3,'Reserva no descuenta stock físico');
assert.equal(db.stockReservations.filter(r=>r.status==='held').length,1);
assert.throws(()=>engine.tx(d=>engine.createOrder(d,{customer:{name:'Otro'},items:[{productId:'P1',qty:2}],shippingTotal:99})),/Stock insuficiente/);
assert.throws(()=>engine.tx(d=>engine.adjustStock(d,'P1',-2)),/reservado/);
assert.throws(()=>engine.tx(d=>engine.shipOrder(d,created.id,'Paquetería','GUIA1')),/pagado/);
assert.throws(()=>engine.tx(d=>engine.createReturn(d,{orderId:created.id,itemIndex:0,qty:1,reason:'Defectuoso'})),/pagado/);
engine.tx(d=>{const o=d.orders.find(x=>x.id===created.id);o.voucher='Comprobante demo';o.payment='review';o.status='review';});
engine.tx(d=>engine.confirmPayment(d,created.id));
db=engine.get();
assert.equal(db.products[0].stock,1);
assert.equal(engine.available(db,'P1'),1);
assert.equal(db.orders[0].payment,'paid');
assert.equal(db.payments.length,1);
assert.equal(db.inventoryMovements.at(-1).delta,-2);
assert.throws(()=>engine.tx(d=>engine.confirmPayment(d,created.id)),/Solo se puede/);
engine.tx(d=>engine.shipOrder(d,created.id,'Paquetería nacional','GUIA001'));
engine.tx(d=>engine.deliverOrder(d,created.id));
db=engine.get();
assert.equal(db.orders[0].status,'delivered');
const returned=engine.tx(d=>engine.createReturn(d,{orderId:created.id,itemIndex:0,qty:1,reason:'Daño'})).value;
assert.equal(returned.amount,100);
assert.throws(()=>engine.tx(d=>engine.createReturn(d,{orderId:created.id,itemIndex:0,qty:2,reason:'Daño'})),/supera/);
for(const step of ['review','received','resolved'])engine.tx(d=>engine.returnNext(d,returned.id,step));
db=engine.get();
assert.equal(db.returns[0].status,'resolved');
assert.equal(db.returns[0].needsSettlement,true,'No ejecutar reembolso automáticamente');
assert.equal(db.refunds.length,1);
assert.equal(db.refunds[0].status,'pending_manual');
assert.throws(()=>engine.tx(d=>engine.returnNext(d,returned.id,'closed')),/documenta el cumplimiento/);
engine.tx(d=>engine.recordSettlement(d,returned.id));
engine.tx(d=>engine.returnNext(d,returned.id,'closed'));
db=engine.get();
assert.equal(db.returns[0].status,'closed');
assert.equal(db.returns[0].needsSettlement,false);
assert.equal(db.refunds[0].status,'manual_demo_recorded');
assert.throws(()=>engine.tx(d=>engine.returnNext(d,returned.id,'rejected')),/transición/);
assert.throws(()=>engine.tx(d=>engine.deleteOrder(d,created.id)),/protegido|pago|devolución/i);
const pending=engine.tx(d=>engine.createOrder(d,{customer:{name:'Client Two'},items:[{productId:'P1',qty:1}],shippingTotal:0})).value;
assert.equal(engine.available(engine.get(),'P1'),0);
engine.tx(d=>engine.cancelOrder(d,pending.id));
assert.equal(engine.available(engine.get(),'P1'),1);
engine.tx(d=>engine.deleteOrder(d,pending.id));
assert.equal(engine.get().stockReservations.some(x=>x.orderId===pending.id),false);
assert.deepEqual(Array.from(engine.audit(engine.get())),[]);
const before=engine.get();engine.tx(d=>{d.store.name='Store 2'});
assert.throws(()=>engine.commit(before,before.revision),/otra pestaña/);
engine.tx(d=>{d.tax.ivaEnabled=true;d.tax.ivaRate=16;d.tax.ivaPriceMode=null});
assert.throws(()=>engine.tx(d=>engine.createOrder(d,{customer:{name:'Tax'},items:[{productId:'P1',qty:1}],shippingTotal:0})),/precio incluye IVA/);
engine.tx(d=>{d.tax.ivaPriceMode='added'});
const taxed=engine.tx(d=>engine.createOrder(d,{customer:{name:'Tax'},items:[{productId:'P1',qty:1}],shippingTotal:0})).value;
assert.equal(taxed.taxTotal,16);
assert.equal(taxed.total,116);
console.log('PASS: stock reservado, pago, envío, devolución, historial, cancelación, IVA y revisiones');
