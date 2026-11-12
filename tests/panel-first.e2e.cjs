'use strict';
/* El orden de apertura debe ser indiferente: primero Panel, luego Tienda. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base='http://127.0.0.1:18765';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try {
  const context=await browser.newContext({viewport:{width:1366,height:850}});
  const errors=[];
  const panel=await context.newPage();
  const store=await context.newPage();
  panel.on('pageerror',e=>errors.push('panel:'+e.message));
  store.on('pageerror',e=>errors.push('tienda:'+e.message));
  await panel.goto(base+'/prototipos/iq-commerce-pos/IQ_COMMERCE_POS_MAESTRO_V41.html#/productos',{waitUntil:'domcontentloaded'});
  await panel.waitForFunction(()=>window.IQCommerceDemo?.get()?.products?.length>=6);
  const before=await panel.evaluate(()=>({n:window.IQCommerceDemo.get().products.length,key:window.IQCommerceDemo.KEY}));
  assert(before.n>=6);
  await store.goto(base+'/tienda-integrada/#/catalogo',{waitUntil:'domcontentloaded'});
  await store.waitForFunction(()=>window.IQCommerceDemo?.get()?.products?.length>=20);
  const canonical=await store.evaluate(()=>window.IQCommerceDemo.get());
  assert(canonical.products.length>=20,'La tienda debe completar el catálogo inicial en el almacén compartido');
  assert.deepEqual(canonical.orders.filter(o=>o.legacy===false&&o.items.length===0),[]);

  await panel.reload({waitUntil:'domcontentloaded'});
  await panel.waitForFunction(()=>window.IQCommerceDemo?.get()?.products?.length>=20);
  const p=await store.evaluate(()=>PRODUCTS[0]);
  assert(p&&p.id&&p.stock>=1);
  await store.evaluate(()=>{
    S.shipping={nombre:'Panel First QA',correo:'panel-first@example.test',telefono:'5512345678',cp:'06000',calle:'Calle de prueba',colonia:'Centro',ciudad:'Ciudad de México'};
    S.paymentMethod='transferencia';S.shippingMethod='estandar';S.step=2;
    S.cart=[{id:PRODUCTS[0].id,size:PRODUCTS[0].presentacion,qty:1,price:PRODUCTS[0].precio}];
    placeOrder();
  });
  const oid=await store.evaluate(()=>S.order?.number);
  assert(oid&&oid.startsWith('LA-'),'El pedido debe crearse desde tienda al abrir primero el panel');
  const remote=await panel.evaluate(id=>window.IQCommerceDemo.get().orders.find(o=>o.id===id),oid);
  assert(remote,'El panel debe ver el pedido creado por la tienda');
  assert.equal(remote.items[0].productId,p.id);
  const available=await panel.evaluate(id=>window.IQCommerceDemo.available(window.IQCommerceDemo.get(),id),p.id);
  assert.equal(available,p.stock-1);
  assert.deepEqual(errors,[]);
  console.log('PASS panel-first: catálogo 20+, orden compartido, stock reservado, sin JS errors');
  await context.close();
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
