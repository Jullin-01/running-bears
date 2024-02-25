import {Launcher} from '../src/launcher/launcher.js'
import './styles.css';

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new Launcher();
}); 