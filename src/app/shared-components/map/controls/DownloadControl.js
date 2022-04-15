import {Control} from 'ol/control';
import localforage from 'localforage';

//
// Define rotate to north control.
//

class DownloadControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = 'Download';
    const element = document.createElement('div');
    element.className = 'ol-download ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleClick.bind(this), false);
  }

  handleClick(e) {
	  console.log(e);

	  e.target.setAttribute("disabled",true);
	  const layers = this.getMap().getLayers();
	  layers.forEach((layer)=>{ {
		  if(layer.getSource().getTileGrid)
			  this.downloadTileLayer(layer,e.target);
	  }});
  } 
  downloadTileLayer=(lyr,button)=> {
	  const source = lyr.getSource();
	if(!source.getTileGrid)
		return;
	const extent = this.getMap().getView().calculateExtent(this.getMap().getSize());
	const zoom = this.getMap().getView().getZoom();
	const tileUrlFunction = source.getTileUrlFunction();
	let totalRequest = 0;
	let totalResponse = 0;
	const promises = []
	Array.from(new Array(7), (x, i) => (i +  zoom)).forEach((z)=>{
		source.tileGrid.forEachTileCoord(extent,z , async function(tileCoord) {
			totalRequest++;
			promises.push(
			new Promise(async (resolve,reject)=>{
				if(await localforage.getItem('OSM_'+tileCoord[0]+'_'+tileCoord[1]+'_'+tileCoord[2]) != null) {
					totalResponse++;
					button.innerHTML = `Downloaded ${totalResponse}/${totalRequest}`;
					button.setAttribute('style','width:350px');
					resolve(true);
					if(totalRequest == totalResponse) {
						button.removeAttribute("disabled");	
						button.removeAttribute("style");	
						button.innerHTML = 'Download';
						alert("Download complete");
		
					}
				} else {
					const img = document.createElement('img');
					img.onload = function() {
						const canvas = document.createElement('canvas');
						canvas.width = source.getTileGrid().getTileSize(z);
						canvas.height = source.getTileGrid().getTileSize(z);;
						const ctx = canvas.getContext('2d');
						ctx.drawImage(img, 0, 0);
						localforage.setItem('OSM_'+tileCoord[0]+'_'+tileCoord[1]+'_'+tileCoord[2], canvas.toDataURL(), function(err) {
						img.remove();
						canvas.remove();
						totalResponse++;
						button.innerHTML = `Downloaded ${totalResponse}/${totalRequest}`;
						button.setAttribute('style','width:350px');
						resolve(true);
						if(totalRequest == totalResponse) {
							button.removeAttribute("disabled");	
							button.removeAttribute("style");	
							button.innerHTML = 'Download';
							alert("Download complete");
			
						}
					});
						
						
					}
					img.crossOrigin = 'anonymous';
					// console.log(tileCoord);
					img.src = tileUrlFunction(tileCoord);
				}
	
				
				
			}));
			});
	});
	Promise.all(promises).then(values=>{
		console.log(values);
	})
	
  }
}
export default DownloadControl;