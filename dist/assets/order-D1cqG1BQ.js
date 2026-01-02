import{W as D}from"./MobileNav-ChPk0N7S.js";function r(a){return`${a.toLocaleString("en-UG")} UGX`}function S(){const s=new Date().toISOString().slice(0,10).replace(/-/g,""),n=Math.random().toString(36).substring(2,6).toUpperCase();return`ORD-${s}-${n}`}function h(a=new Date){return a.toLocaleDateString("en-UG",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}function y(a,s,n,i,c,$,d="Pay on Delivery"){const u=h();let e=`🍽️ *NEW ORDER - 9Yards Food*

`;return e+=`*Order #:* ${a}
`,e+=`*Date:* ${u}

`,e+=`📋 *ORDER DETAILS:*
`,s.forEach((t,p)=>{const l=t.mainDishes.join(" + "),g=t.sauce?`${t.sauce.name} (${t.sauce.preparation}, ${t.sauce.size})`:"No sauce";e+=`${p+1}. ${l} + ${g} + ${t.sideDish}
`,e+=`   Qty: ${t.quantity} × ${r(t.totalPrice)}
`,t.extras.length>0&&(e+=`   Extras: ${t.extras.map(o=>`${o.name} (${o.quantity})`).join(", ")}
`)}),e+=`
🚚 *DELIVERY INFO:*
`,e+=`*Name:* ${n.name}
`,e+=`*Phone:* ${n.phone}
`,e+=`*Location:* ${n.location}
`,e+=`*Address:* ${n.address}
`,n.specialInstructions&&(e+=`*Special Instructions:* ${n.specialInstructions}
`),e+=`
💰 *PAYMENT SUMMARY:*
`,e+=`*Subtotal:* ${r(i)}
`,e+=`*Delivery Fee:* ${r(c)}
`,e+=`*Total:* ${r($)}

`,e+=`*Payment Method:* ${d}

`,e+="⏰ *Estimated Delivery:* 30-45 minutes",encodeURIComponent(e)}function R(a){return`https://wa.me/${D}?text=${a}`}export{y as a,R as b,r as f,S as g};
