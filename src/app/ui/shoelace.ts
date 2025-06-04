// стили и компоненты shoelace которые используются в модуле app

// стили shoelace
import '@shoelace-style/shoelace/dist/themes/light.css';

// компоненты shoelace
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';

// установка базового пути по которому будут загружаться статичные файлы shoelace
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('.');
