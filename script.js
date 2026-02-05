const imageInput = document.getElementById('imageInput');
const productNameInput = document.getElementById('productName');
const priceInput = document.getElementById('price');
const offerInput = document.getElementById('offer');
const brandInput = document.getElementById('brand');
const generateBtn = document.getElementById('generateBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const gallery = document.getElementById('gallery');

const templates = [
  { name: 'Main Hero', colors: ['#f97316', '#ef4444'], badge: 'Bestseller' },
  { name: 'Offer Focus', colors: ['#8b5cf6', '#06b6d4'], badge: 'Limited Offer' },
  { name: 'Premium Look', colors: ['#0ea5e9', '#1d4ed8'], badge: 'Top Quality' },
  { name: 'Trust Card', colors: ['#10b981', '#0f766e'], badge: 'Trusted by Buyers' },
  { name: 'Fast Dispatch', colors: ['#e11d48', '#7e22ce'], badge: 'Quick Dispatch' },
  { name: 'Brand Story', colors: ['#f59e0b', '#ea580c'], badge: 'New Arrival' },
];

let productImage = null;
let generated = [];

imageInput.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      productImage = img;
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

generateBtn.addEventListener('click', () => {
  if (!productImage) {
    alert('Please upload a product image first.');
    return;
  }

  const data = {
    productName: productNameInput.value.trim() || 'Stylish Product',
    price: priceInput.value.trim() || '499',
    offer: offerInput.value.trim() || '20% OFF',
    brand: brandInput.value.trim() || 'Krishnity Store',
  };

  generated = templates.map((template, index) =>
    buildCanvas(template, data, productImage, index)
  );
  renderGallery(generated);
  downloadAllBtn.disabled = false;
});

downloadAllBtn.addEventListener('click', () => {
  generated.forEach((item, idx) => {
    const a = document.createElement('a');
    a.href = item.canvas.toDataURL('image/png');
    a.download = `meesho-image-${idx + 1}.png`;
    a.click();
  });
});

function buildCanvas(template, data, image, idx) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;

  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, template.colors[0]);
  grad.addColorStop(1, template.colors[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(55, 55, 970, 970);

  const bounds = fitInside(image.width, image.height, 600, 620);
  const imgX = (canvas.width - bounds.w) / 2;
  const imgY = 180;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 45;
  roundRect(ctx, imgX - 12, imgY - 12, bounds.w + 24, bounds.h + 24, 24);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.restore();

  ctx.drawImage(image, imgX, imgY, bounds.w, bounds.h);

  drawTag(ctx, template.badge, 70, 70);
  drawTag(ctx, `${data.offer}`, 750, 70, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText(data.productName.slice(0, 26), 70, 860);

  ctx.font = 'bold 64px sans-serif';
  ctx.fillText(`₹${data.price}`, 70, 945);

  ctx.font = '500 36px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText(data.brand, 70, 1005);

  ctx.textAlign = 'right';
  ctx.font = '600 34px sans-serif';
  ctx.fillText(`Style ${idx + 1}`, 1005, 1005);
  ctx.textAlign = 'left';

  return { template: template.name, canvas };
}

function renderGallery(items) {
  gallery.innerHTML = '';

  items.forEach((item, idx) => {
    const tile = document.createElement('article');
    tile.className = 'tile';

    tile.appendChild(item.canvas);

    const footer = document.createElement('div');
    footer.className = 'tile-footer';

    const label = document.createElement('small');
    label.textContent = item.template;

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'secondary';
    downloadBtn.textContent = 'Download';
    downloadBtn.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = item.canvas.toDataURL('image/png');
      a.download = `meesho-image-${idx + 1}.png`;
      a.click();
    });

    footer.append(label, downloadBtn);
    tile.appendChild(footer);
    gallery.appendChild(tile);
  });
}

function drawTag(ctx, text, x, y, dark = false) {
  ctx.font = '600 34px sans-serif';
  const w = ctx.measureText(text).width + 42;
  const h = 62;

  roundRect(ctx, x, y, w, h, 31);
  ctx.fillStyle = dark ? 'rgba(15,23,42,0.86)' : 'rgba(255,255,255,0.9)';
  ctx.fill();

  ctx.fillStyle = dark ? '#ffffff' : '#0f172a';
  ctx.fillText(text, x + 21, y + 41);
}

function fitInside(srcW, srcH, maxW, maxH) {
  const ratio = Math.min(maxW / srcW, maxH / srcH);
  return {
    w: srcW * ratio,
    h: srcH * ratio,
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
