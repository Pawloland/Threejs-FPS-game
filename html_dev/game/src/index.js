import Main from './components/Main';
import Database from './components/Database';
import './style.css';

async function init() {
    // try {
    //     document.getElementsByTagName('img')[0].src = terrain
    //     document.getElementsByTagName('img')[1].src = wall
    // } catch (e) { }
    const container = document.getElementById('root');
    new Main(container, (await Database.getLevel()));
}

init();