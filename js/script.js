document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#grid");
  if (!grid) return;
  const catalogo = window.CATALOGO || {};
  const productos = catalogo[grid.dataset.cat] || [];
  const modal = document.querySelector("#modal");
  const escapar = (valor = "") => String(valor).replace(/[&<>"']/g, caracter => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[caracter]);
  const placeholder = categoria => `<div class="artPlaceholder"><span class="artSymbol">G<span>V3</span></span><small>IMAGEN PRÓXIMAMENTE</small></div><span class="artTag">${escapar(categoria)}</span><span class="artBrand">GUAYAQUIL <b>V3</b></span>`;
  const imagenProducto = (p, clase="") => {
    const nombre = escapar(p[0] || "Producto"), categoria = escapar(p[4] || "GUAYAQUIL V3");
    const imagen = typeof p[5] === "string" ? p[5].trim() : "";
    if (!imagen) return `<div class="${clase} no-image">${placeholder(categoria)}</div>`;
    return `<div class="${clase}"><img class="productImage" src="${escapar(imagen)}" alt="${nombre}" loading="lazy"><span class="artTag">${categoria}</span><span class="artBrand">GUAYAQUIL <b>V3</b></span></div>`;
  };
  grid.innerHTML = productos.map((p,i) => `<article class="product" data-i="${i}" tabindex="0" role="button" aria-label="Ver ${escapar(p[0])}">${imagenProducto(p,"prodArt")}<div class="prodInfo"><small>${escapar(p[4])}</small><h3>${escapar(p[0])}</h3><div class="price">${p[2] ? `<s>${escapar(p[2])}</s>` : ""}<b>${escapar(p[1])}</b></div><p>${escapar(p[3])}</p><strong class="viewProduct">VER FICHA <span>↗</span></strong></div></article>`).join("");
  grid.querySelectorAll("img.productImage").forEach(img => img.addEventListener("error", () => { const box=img.parentElement; img.remove(); box.classList.add("no-image"); const cat=box.querySelector(".artTag")?.textContent || "GUAYAQUIL V3"; box.insertAdjacentHTML("afterbegin", placeholder(cat)); }, {once:true}));
  const abrirFicha = indice => {
    const p=productos[indice]; if(!p || !modal) return;
    const categoria=document.querySelector("#mcat"), titulo=document.querySelector("#mtitle"), precio=document.querySelector("#mprice"), descripcion=document.querySelector("#mdesc"), arte=modal.querySelector(".modalArt");
    if(categoria) categoria.textContent=`${p[4]} / GUAYAQUIL V3`; if(titulo) titulo.textContent=p[0]||""; if(descripcion) descripcion.textContent=p[3]||"";
    if(precio){ precio.replaceChildren(); if(p[2]){const old=document.createElement("s");old.textContent=p[2];precio.append(old);} const now=document.createElement("b");now.textContent=p[1]||"";precio.append(now); }
    if(arte){const imagen=typeof p[5]==="string"?p[5].trim():"";arte.replaceChildren();arte.classList.toggle("no-image",!imagen);if(imagen){const img=document.createElement("img");img.className="modalProductImage";img.src=imagen;img.alt=p[0]||"Producto";img.onerror=()=>{img.remove();arte.classList.add("no-image");arte.innerHTML=placeholder(p[4]||"GUAYAQUIL V3");};arte.append(img);}else{arte.innerHTML=placeholder(p[4]||"GUAYAQUIL V3");}}
    modal.classList.remove("hidden");
  };
  grid.addEventListener("click",e=>{const card=e.target.closest(".product");if(card) abrirFicha(Number(card.dataset.i));});
  grid.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const card=e.target.closest(".product");if(!card)return;e.preventDefault();abrirFicha(Number(card.dataset.i));});
  const cerrar=()=>modal?.classList.add("hidden"); document.querySelector("#x")?.addEventListener("click",cerrar);document.querySelector(".shade")?.addEventListener("click",cerrar);document.addEventListener("keydown",e=>{if(e.key==="Escape")cerrar();});
});
