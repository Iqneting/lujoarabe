/* IQ Commerce POS — puente local V41. Simulador, NO backend.
 * Ambas vistas deben abrirse bajo EL MISMO origen HTTP(s), no file://.
 * Modelo de dominio portable a endpoints: snapshots, stock, estados, devoluciones.
 */
(function(root){
'use strict';
const KEY='iqcommerce_integracion_local_v1';
const ver=1;
const copy=x=>JSON.parse(JSON.stringify(x));
const round=n=>Math.round((Number(n)+Number.EPSILON)*100)/100;
const cents=n=>Math.round((Number(n)+Number.EPSILON)*100);
const money=n=>round(n);
const uid=(prefix)=>prefix+'-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,9).toUpperCase();
function fail(msg){throw new Error(msg)}
function blank(seed){
 const s=copy(seed||{});
 if(!Array.isArray(s.products))s.products=[];
 if(!Array.isArray(s.categories))s.categories=[];
 if(!Array.isArray(s.orders))s.orders=[];
 for(const key of ['returns','customers','coupons','content','operators','activity','inventoryMovements','stockReservations','payments','couponRedemptions','refunds','storeCredits','exchanges'])if(!Array.isArray(s[key]))s[key]=[];
 s.tax={ivaEnabled:false,ivaRate:16,...(s.tax||{})};
 s.bank={name:'',holder:'',clabe:'',active:false,...(s.bank||{})};
 s.shipping={standard:99,freeFrom:1500,carriers:['Paquetería nacional'],...(s.shipping||{})};
 s.store={name:'Mi tienda',phone:'',email:'',...(s.store||{})};
 if(s.motion===undefined)s.motion=true;
 for(const p of s.products){p.stock=Number(p.stock)||0;p.price=money(p.price);p.active=p.active!==false;p.images=Array.isArray(p.images)?p.images:[];}
 for(const o of s.orders){
  o.items=Array.isArray(o.items)?o.items:[];
  if(o.items.length===0||o.items.some(it=>!it.productId||!Number.isFinite(Number(it.unitPrice)))){
   o.legacy=true; // snapshots desconocidos: no inventar importes históricos
  }
 }
 s.schemaVersion=ver;
 s.revision=Number(s.revision)||0;
 return s;
}
function raw(){try{const val=JSON.parse(localStorage.getItem(KEY));return val&&val.schemaVersion===ver&&Array.isArray(val.products)&&Array.isArray(val.orders)?val:null}catch(e){return null}}
function boot(seed){
 const existing=raw();
 if(existing)return blank(existing);
 const first=blank(seed);
 try{localStorage.setItem(KEY,JSON.stringify(first))}catch(e){fail('No se puede iniciar almacenamiento local compartido')}
 return first;
}
function get(){const value=raw();return value?blank(value):null}
function available(d,productId){
 const p=d.products.find(x=>String(x.id)===String(productId));
 if(!p)return 0;
 const held=d.stockReservations.filter(r=>r.productId===p.id&&r.status==='held').reduce((a,r)=>a+Number(r.qty||0),0);
 return Math.max(0,(Number(p.stock)||0)-held);
}
function audit(d){
 const problems=[];
 const uniq=(items,label)=>{const keys=new Set();for(const x of items){if(!x.id||keys.has(x.id))problems.push('Identificador duplicado o vacío: '+label);keys.add(x.id)}};
 uniq(d.products,'producto');uniq(d.orders,'pedido');uniq(d.returns,'devolución');
 for(const p of d.products)if(!Number.isFinite(Number(p.stock))||Number(p.stock)<0||!Number.isFinite(Number(p.price))||Number(p.price)<0)problems.push('Stock/precio inválido: '+p.id);
 for(const r of d.stockReservations){
  const o=d.orders.find(x=>x.id===r.orderId),p=d.products.find(x=>x.id===r.productId);
  if(!o||!p||!Number.isInteger(r.qty)||r.qty<=0)problems.push('Reserva huérfana: '+r.orderId);
  if(r.status==='held'&&o&&(['paid','cancelled','shipped','delivered'].includes(o.status)||o.payment==='paid'))problems.push('Reserva activa en orden concluida: '+o.id);
 }
 for(const p of d.products)if(available(d,p.id)<0||d.stockReservations.filter(r=>r.status==='held'&&r.productId===p.id).reduce((s,r)=>s+r.qty,0)>p.stock)problems.push('Sobreventa/reserva excedida: '+p.id);
 for(const o of d.orders){
  if(o.legacy)continue;
  if(!o.items.length)problems.push('Pedido sin productos: '+o.id);
  for(const it of o.items){
   if(!it.productId||!Number.isInteger(Number(it.qty))||Number(it.qty)<=0||!Number.isFinite(Number(it.unitPrice))||Number(it.unitPrice)<0||!Number.isFinite(Number(it.lineTotal)))problems.push('Línea inválida: '+o.id);
  }
  if(!Number.isFinite(Number(o.total))||o.total<0)problems.push('Total inválido: '+o.id);
  if(o.payment==='paid'&&['pending','review'].includes(o.status))problems.push('Pago confirmado en estado de espera: '+o.id);
 }
 for(const r of d.returns){
  if(r.status==='closed'&&r.needsSettlement)problems.push('Devolución cerrada sin liquidación registrada: '+r.id);
  if(r.legacy)continue;
  const o=d.orders.find(x=>x.id===r.orderId);
  if(!o)problems.push('Devolución sin pedido: '+r.id);
  else if(!o.items[Number(r.itemIndex)])problems.push('Devolución sin artículo: '+r.id);
 }
 return problems;
}
function commit(next,expectedRev){
 const current=raw();
 if(!current)fail('La sesión local no existe: abre primero una vista integrada');
 if(current.revision!==expectedRev)fail('Datos actualizados en otra pestaña. Recarga antes de guardar');
 const doc=blank(next);
 doc.revision=current.revision+1;
 const issues=audit(doc);
 if(issues.length)fail('Integridad de datos: '+issues[0]);
 try{localStorage.setItem(KEY,JSON.stringify(doc))}catch(e){fail('Almacenamiento local lleno o no disponible')}
 try{root.dispatchEvent(new CustomEvent('iqcommerce-demo-updated',{detail:{revision:doc.revision}}))}catch(e){}
 return copy(doc);
}
function tx(mutator){
 const before=get();
 if(!before)fail('Abre primero la tienda o el panel integrado');
 const next=copy(before);
 const value=mutator(next);
 const updated=commit(next,before.revision);
 return {value,db:updated};
}
function priceItems(d,items){
 if(!Array.isArray(items)||!items.length)fail('Elige al menos un producto');
 const merged=new Map();
 for(const it of items){
  const id=String(it.productId||'');
  const qty=Number(it.qty);
  if(!Number.isInteger(qty)||qty<1||qty>999)fail('Cantidad no válida');
  merged.set(id,(merged.get(id)||0)+qty);
 }
 const entries=[];
 for(const [id,qty] of merged){
  const p=d.products.find(x=>String(x.id)===id);
  if(!p||!p.active)fail('Producto no disponible');
  if(qty>available(d,id))fail('Stock insuficiente de '+p.name);
  if(!Number.isFinite(Number(p.price))||Number(p.price)<=0)fail('Precio no válido de '+p.name);
  const lineBase=cents(p.price)*qty,rate=d.tax.ivaEnabled?Number(d.tax.ivaRate):0,mode=d.tax.ivaPriceMode;
  if(d.tax.ivaEnabled&&!['included','added'].includes(mode))fail('Define si el precio incluye IVA o si se agrega antes de crear un pedido');
  const taxCents=d.tax.ivaEnabled?(mode==='included'?lineBase-Math.round(lineBase/(1+rate/100)):Math.round(lineBase*rate/100)):0;
  const gross=lineBase+(mode==='added'?taxCents:0);
  entries.push({productId:p.id,variantId:p.id,sku:p.code||null,name:p.name,qty,unitPrice:money(p.price),
   subtotal:lineBase/100,discountTotal:0,taxRate:rate,taxTotal:taxCents/100,lineTotal:gross/100});
 }
 return entries;
}

function couponFor(d,code,subtotalCents){
 const value=String(code||'').trim().toUpperCase();
 if(!value)return {coupon:null,discountCents:0};
 const coupon=d.coupons.find(x=>String(x.code).trim().toUpperCase()===value);
 if(!coupon||!coupon.active)fail('Cupón no disponible');
 const today=new Date().toISOString().slice(0,10);
 if(coupon.from&&today<String(coupon.from).slice(0,10))fail('El cupón aún no inicia');
 if(coupon.to&&today>String(coupon.to).slice(0,10))fail('El cupón ya venció');
 if(coupon.limit!==undefined&&coupon.limit!==null&&Number(coupon.used||0)>=Number(coupon.limit))fail('Cupón agotado');
 const pct=Number(coupon.percent||0);
 const credit=Number(coupon.credit||0);
 if((!pct||pct<0)&&(!credit||credit<=0))fail('Cupón sin descuento válido');
 if(pct>100||pct<0)fail('Porcentaje de cupón inválido');
 const discountCents=pct>0?Math.round(subtotalCents*pct/100):Math.min(subtotalCents,cents(credit));
 if(discountCents<0)fail('Descuento inválido');
 return {coupon,discountCents};
}
function quoteOrder(d,inputs,shippingTotal=0,couponCode=''){
 const items=priceItems(d,inputs);
 const shipping=Number(shippingTotal);
 if(!Number.isFinite(shipping)||shipping<0||shipping>100000)fail('Entrega no válida');
 const subtotalCents=items.reduce((s,x)=>s+cents(x.subtotal),0);
 const {coupon,discountCents}=couponFor(d,couponCode,subtotalCents);
 let allocated=0;
 for(let i=0;i<items.length;i++){
  const line=items[i];
  let discount=i===items.length-1?discountCents-allocated:Math.floor(discountCents*cents(line.subtotal)/subtotalCents);
  discount=Math.max(0,Math.min(discount,cents(line.subtotal)));allocated+=discount;
  const reduced=cents(line.subtotal)-discount,rate=d.tax.ivaEnabled?Number(d.tax.ivaRate):0;
  const tax=rate>0?(d.tax.ivaPriceMode==='included'?reduced-Math.round(reduced/(1+rate/100)):Math.round(reduced*rate/100)):0;
  line.discountTotal=discount/100;line.taxTotal=tax/100;
  line.lineTotal=(reduced+(d.tax.ivaPriceMode==='added'?tax:0))/100;
 }
 const subtotal=subtotalCents/100,discountTotal=discountCents/100;
 const taxTotal=round(items.reduce((s,i)=>s+i.taxTotal,0));
 const total=round(items.reduce((s,i)=>s+i.lineTotal,0)+shipping);
 return {items,subtotal,discountTotal,taxTotal,shippingTotal:shipping,total,coupon};
}
function createOrder(d,args){
 const name=String(args.customer?.name||'').trim();
 const email=String(args.customer?.email||'').trim().toLowerCase();
 if(!name||name.length>160)fail('Indica un nombre válido');
 if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail('Correo no válido');
 const quote=quoteOrder(d,args.items,args.shippingTotal||0,args.couponCode||'');
 const {items,subtotal,discountTotal,taxTotal,shippingTotal,total,coupon}=quote;
 let c=email?d.customers.find(x=>String(x.email||'').toLowerCase()===email):null;
 if(!c){c={id:uid('C'),name,email,phone:String(args.customer.phone||''),createdAt:new Date().toISOString()};d.customers.push(c)}
 const o={id:uid('LA'),customerId:c.id,customer:name,customerEmail:email,
  date:new Date().toISOString(),status:'pending',payment:'pending',paymentMethod:args.paymentMethod||'transferencia',channel:args.channel||'storefront_demo',
  items,subtotal,shippingTotal,discountTotal,taxTotal,total,couponId:coupon?.id||null,couponCode:coupon?.code||null,
  ivaEnabledSnapshot:Boolean(d.tax.ivaEnabled),ivaRateSnapshot:d.tax.ivaEnabled?Number(d.tax.ivaRate):0,
  ivaPriceModeSnapshot:d.tax.ivaPriceMode||null,carrier:'',tracking:'',voucher:'',note:'',
  address:args.shipping||null,history:[{at:new Date().toISOString(),status:'pending'}]};
 d.orders.unshift(o);
 for(const it of items)d.stockReservations.push({id:uid('RES'),orderId:o.id,productId:it.productId,qty:it.qty,status:'held'});
 if(coupon){
  coupon.used=Number(coupon.used||0)+1;
  d.couponRedemptions.push({id:uid('CPN'),couponId:coupon.id,orderId:o.id,amount:discountTotal,status:'held',at:new Date().toISOString()});
 }
 d.activity.unshift({date:new Date().toISOString(),text:'Pedido local creado: '+o.id});d.activity=d.activity.slice(0,60);
 return o;
}

function confirmPayment(d,id){
 const o=d.orders.find(x=>x.id===id);
 if(!o||o.status!=='review'||o.payment!=='review'||!o.voucher)fail('Solo se puede verificar un comprobante pendiente de revisión');
 if(!o.legacy){
  for(const it of o.items){
   const p=d.products.find(x=>x.id===it.productId);
   const reservation=d.stockReservations.find(r=>r.orderId===id&&r.productId===it.productId&&r.status==='held');
   if(!p||!reservation||reservation.qty!==it.qty||p.stock<it.qty)fail('Reserva o inventario inconsistente');
  }
  for(const it of o.items){
   const p=d.products.find(x=>x.id===it.productId);
   const reservation=d.stockReservations.find(r=>r.orderId===id&&r.productId===it.productId&&r.status==='held');
   p.stock-=it.qty;reservation.status='committed';
   d.inventoryMovements.push({id:uid('MOV'),productId:p.id,orderId:id,delta:-it.qty,reason:'sale',at:new Date().toISOString()});
  }
 }
 o.payment='paid';o.status='preparing';
 o.history=[...(o.history||[]),{at:new Date().toISOString(),status:o.status}];
 d.payments.push({id:uid('PAY'),orderId:id,amount:o.total,method:o.paymentMethod||'transferencia',status:'verified',at:new Date().toISOString(),demo:true});
 d.couponRedemptions.filter(x=>x.orderId===id&&x.status==='held').forEach(x=>x.status='committed');
 if(o.couponCode)d.storeCredits.filter(x=>x.code===o.couponCode).forEach(x=>{x.remaining=0;x.status='consumed_demo'});
 return o;
}
function cancelOrder(d,id){
 const o=d.orders.find(x=>x.id===id);
 if(!o||o.status==='cancelled'||o.status==='delivered')fail('El pedido no puede cancelarse en su estado actual');
 if(o.status==='shipped')fail('Una orden enviada requiere gestionar devolución, no cancelación simple');
 for(const r of d.stockReservations.filter(x=>x.orderId===id&&x.status==='held'))r.status='released';
 if(o.couponId&&o.payment!=='paid'&&!o.couponReleased){
  const coupon=d.coupons.find(x=>x.id===o.couponId);
  if(coupon)coupon.used=Math.max(0,Number(coupon.used||0)-1);
  d.couponRedemptions.filter(x=>x.orderId===id&&x.status==='held').forEach(x=>x.status='released');
  if(o.couponCode)d.storeCredits.filter(x=>x.code===o.couponCode&&x.status!=='consumed_demo').forEach(x=>{x.status='available';x.remaining=x.amount});
  o.couponReleased=true;
 }
 o.status='cancelled';o.refundRequired=o.payment==='paid';
 o.history=[...(o.history||[]),{at:new Date().toISOString(),status:'cancelled'}];
 return o;
}
function shipOrder(d,id,carrier,tracking){
 const o=d.orders.find(x=>x.id===id);
 if(!o||o.payment!=='paid'||o.status!=='preparing')fail('Solo se envía un pedido preparado y pagado');
 if(!String(tracking||'').trim()||!String(carrier||'').trim())fail('Paquetería y número de guía obligatorios');
 o.carrier=String(carrier);o.tracking=String(tracking).trim();
 o.status='shipped';o.history=[...(o.history||[]),{at:new Date().toISOString(),status:'shipped'}];
 return o;
}
function deliverOrder(d,id){
 const o=d.orders.find(x=>x.id===id);
 if(!o||o.payment!=='paid'||o.status!=='shipped')fail('El pedido debe estar enviado y pagado');
 o.status='delivered';o.history=[...(o.history||[]),{at:new Date().toISOString(),status:'delivered'}];return o;
}
function rejectPayment(d,id){
 const o=d.orders.find(x=>x.id===id);
 if(!o||o.payment!=='review'||o.status!=='review')fail('El comprobante no está en revisión');
 o.payment='pending';o.status='pending';o.voucher='';o.voucherPreview='';
 o.history=[...(o.history||[]),{at:new Date().toISOString(),status:'pending'}];return o;
}
function adjustStock(d,id,delta){
 const p=d.products.find(x=>x.id===id);if(!p||!Number.isInteger(delta)||!delta)fail('Ajuste no válido');
 const reserved=d.stockReservations.filter(x=>x.productId===id&&x.status==='held').reduce((s,r)=>s+r.qty,0);
 if(p.stock+delta<reserved)fail('No se puede retirar stock reservado para pedidos');
 p.stock+=delta;d.inventoryMovements.push({id:uid('MOV'),productId:id,delta,reason:'manual_adjustment',at:new Date().toISOString()});
 return p;
}
function deleteOrder(d,id){
 const o=d.orders.find(x=>x.id===id);
 if(!o||o.payment==='paid'||!['pending','review','cancelled'].includes(o.status)||d.returns.some(r=>r.orderId===id))fail('El pedido tiene pago, devolución o historial protegido; no puede eliminarse');
 for(const r of d.stockReservations.filter(x=>x.orderId===id))r.status='released';
 if(o.couponId&&!o.couponReleased){
  const coupon=d.coupons.find(x=>x.id===o.couponId);
  if(coupon)coupon.used=Math.max(0,Number(coupon.used||0)-1);
 }
 d.couponRedemptions=d.couponRedemptions.filter(x=>x.orderId!==id);
 d.stockReservations=d.stockReservations.filter(x=>x.orderId!==id);
 d.orders=d.orders.filter(x=>x.id!==id);return o;
}
function createReturn(d,args){
 const o=d.orders.find(x=>x.id===args.orderId);
 if(!o||o.payment!=='paid'||o.status==='cancelled'||o.legacy)fail('El pedido debe estar pagado y tener artículos con precios originales');
 const index=Number(args.itemIndex),it=o.items[index],qty=Number(args.qty);
 if(!it||!it.productId||!Number.isFinite(Number(it.lineTotal)))fail('Artículo original no disponible');
 if(!Number.isInteger(qty)||qty<1)fail('Cantidad inválida');
 const already=d.returns.filter(r=>r.orderId===o.id&&Number(r.itemIndex)===index&&r.status!=='rejected').reduce((s,r)=>s+Number(r.qty||0),0);
 if(qty+already>it.qty)fail('La cantidad supera las unidades compradas');
 const reason=String(args.reason||'').trim();if(!reason)fail('Selecciona motivo');
 const unit=cents(it.lineTotal)/Number(it.qty);
 const amount=money(unit*qty/100);
 const r={id:uid('DEV'),orderId:o.id,itemIndex:index,orderItemId:o.id+':'+index,
 customer:o.customer,productId:it.productId,productName:it.name,productImage:d.products.find(p=>p.id===it.productId)?.images?.[0]||'',qty,amount,reason,
 resolution:'refund',status:'requested',date:new Date().toISOString(),updatedAt:new Date().toISOString(),
 history:[{state:'requested',at:new Date().toISOString()}],evidence:args.evidence||'',demo:true};
 d.returns.unshift(r);return r;
}
function returnNext(d,id,next){
 const r=d.returns.find(x=>x.id===id);if(!r)fail('Devolución no encontrada');
 const stages={requested:'review',review:'received',received:'resolved',resolved:'closed'};
 if(next!==stages[r.status]&&!(next==='rejected'&&['requested','review','received'].includes(r.status)))fail('La transición de devolución no es válida');
 if(next==='closed'&&r.needsSettlement)fail('Primero documenta el cumplimiento de la resolución');
 if(next==='resolved'){
  if(!['refund','exchange','credit','store_credit'].includes(r.resolution))fail('Selecciona resolución válida');
  const amount=Number(r.amount)||0;
  if(amount<=0)fail('Importe no válido de devolución');
  if(r.resolution==='credit'||r.resolution==='store_credit'){
   const code=uid('DEV').replace(/-/g,'').slice(0,20);
   const couponId=uid('CU');
   d.storeCredits.push({id:uid('SC'),returnId:r.id,code,amount,remaining:amount,status:'available'});
   d.coupons.push({id:couponId,code,percent:0,credit:amount,active:true,
    from:new Date().toISOString().slice(0,10),to:'2099-12-31',limit:1,used:0});
   r.creditCode=code;r.settlementStatus='credit_issued';r.needsSettlement=false;
  }else if(r.resolution==='refund'){
   d.refunds.push({id:uid('REF'),returnId:r.id,orderId:r.orderId,amount,status:'pending_manual',createdAt:new Date().toISOString(),demo:true});
   r.settlementStatus='pending_manual';r.needsSettlement=true;
  }else{
   d.exchanges.push({id:uid('EX'),returnId:r.id,orderId:r.orderId,productId:r.productId,qty:r.qty,status:'pending_fulfillment',demo:true});
   r.settlementStatus='pending_fulfillment';r.needsSettlement=true;
  }
 }
 r.status=next;r.updatedAt=new Date().toISOString();r.history=[...(r.history||[]),{state:next,at:r.updatedAt}];
 return r;
}
function recordSettlement(d,id){
 const r=d.returns.find(x=>x.id===id);
 if(!r||r.status!=='resolved'||!r.needsSettlement)fail('La resolución no tiene un cumplimiento pendiente');
 if(r.resolution==='refund'){
  const refund=d.refunds.find(x=>x.returnId===id&&x.status==='pending_manual');
  if(!refund)fail('No se encontró la solicitud de reembolso');
  refund.status='manual_demo_recorded';refund.confirmedAt=new Date().toISOString();
 }else if(r.resolution==='exchange'){
  const exchange=d.exchanges.find(x=>x.returnId===id&&x.status==='pending_fulfillment');
  if(!exchange)fail('No se encontró el cambio pendiente');
  exchange.status='fulfilled_demo';exchange.confirmedAt=new Date().toISOString();
 }else fail('La emisión de crédito no requiere esta acción');
 r.needsSettlement=false;r.settlementStatus='confirmed_demo';
 r.updatedAt=new Date().toISOString();
 r.history=[...(r.history||[]),{state:'settlement_demo_recorded',at:r.updatedAt}];
 return r;
}
root.IQCommerceDemo={KEY,boot,get,commit,tx,audit,available,priceItems,quoteOrder,createOrder,confirmPayment,
 cancelOrder,shipOrder,deliverOrder,rejectPayment,adjustStock,deleteOrder,createReturn,returnNext,recordSettlement,uid};
})(typeof window!=='undefined'?window:globalThis);
