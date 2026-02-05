const imageInput = document.getElementById('imageInput');
const generateBtn = document.getElementById('generateBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const gallery = document.getElementById('gallery');

const templates = [
  { name: 'Orange Border', bg: ['#fff7ed', '#ffedd5'], border: '#f97316' },
  { name: 'Purple Border', bg: ['#faf5ff', '#f3e8ff'], border: '#8b5cf6' },
  { name: 'Blue Border', bg: ['#eff6ff', '#dbeafe'], border: '#2563eb' },
  { name: 'Green Border', bg: ['#ecfdf5', '#d1fae5'], border: '#059669' },
  { name: 'Pink Border', bg: ['#fdf2f8', '#fce7f3'], border: '#db2777' },
  { name: 'Teal Border', bg: ['#f0fdfa', '#ccfbf1'], border: '#0f766e' },
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

  generated = templates.map((template, index) =>
    buildCanvas(template, productImage, index)
  );
  renderGallery(generated);
  downloadAllBtn.disabled = false;
});

downloadAllBtn.addEventListener('click', () => {
  generated.forEach((item, idx) => {
    const a = document.createElement('a');
    a.href = item.canvas.toDataURL('image/png');
    a.download = `meesho-border-image-${idx + 1}.png`;
    a.click();
  });
});

function buildCanvas(template, image, idx) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;

  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, template.bg[0]);
  grad.addColorStop(1, template.bg[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const imageBounds = fitInside(image.width, image.height, 820, 820);
  const imgX = (canvas.width - imageBounds.w) / 2;
  const imgY = (canvas.height - imageBounds.h) / 2;

  const borderPadding = 24;
  const borderRadius = 36;

  roundRect(
    ctx,
    imgX - borderPadding,
    imgY - borderPadding,
    imageBounds.w + borderPadding * 2,
    imageBounds.h + borderPadding * 2,
    borderRadius
  );
  ctx.fillStyle = 'white';
  ctx.fill();

  ctx.lineWidth = 18;
  ctx.strokeStyle = template.border;
  ctx.stroke();

  ctx.save();
  roundRect(ctx, imgX, imgY, imageBounds.w, imageBounds.h, 24);
  ctx.clip();
  ctx.drawImage(image, imgX, imgY, imageBounds.w, imageBounds.h);
  ctx.restore();

  return { template: `${template.name} ${idx + 1}`, canvas };
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
      a.download = `meesho-border-image-${idx + 1}.png`;
      a.click();
    });

    footer.append(label, downloadBtn);
    tile.appendChild(footer);
    gallery.appendChild(tile);
  });
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
