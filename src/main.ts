import '@/assets/css/index.css';
import favicon from '@/assets/image/fb_icon.ico';
import routes from '@/routes/routes';

const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/x-icon';
link.href = favicon;
document.head.appendChild(link);

routes();
