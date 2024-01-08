import {Launcher} from './launcher.js'
import './styles.css';

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new Launcher();
}); 