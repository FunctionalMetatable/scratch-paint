import bindAll from 'lodash.bindall';
import React from 'react';
import ReactDOM from 'react-dom';
import PaintEditor from '..';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import Button2Component from '../components/button2/button2.jsx'
import Modal from '../components/modal/modal.jsx'
import reducer from './reducers/combine-reducers';
import {intlInitialState, IntlProvider} from './reducers/intl.js';
import styles from './playground.css';
import LibraryItemComponent from '../components/library-item/library-item.jsx'
import regeneratorRuntime from "regenerator-runtime";
// scratch-render-fonts is a playground-only dep. Fonts are expected to be imported
// as a peer dependency, otherwise there will be two copies of them.
import {FONTS} from 'scratch-render-fonts';
import costumes from './lib/costumes.json'
import cssProperties from 'react-style-proptype/src/css-properties';
const appTarget = document.createElement('div');
appTarget.setAttribute('class', styles.playgroundContainer);
document.body.appendChild(appTarget);
const store = createStore(
    reducer,
    intlInitialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const svgString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="87.99945" height="88.00142" viewBox="0,0,87.99945,88.00142"><g transform="translate(-196.00028,-135.99929)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M280.76164,224.00071c-0.82849,0 -1.65698,-0.31661 -2.29021,-0.94721l-80.84584,-80.84848c-1.26384,-1.26384 -1.26384,-3.31657 0,-4.58041c1.26384,-1.26384 3.31657,-1.26384 4.58041,0l80.84584,80.84584c1.26384,1.26384 1.26384,3.31657 0,4.58041c-0.63324,0.6306 -1.46173,0.94985 -2.29021,0.94985z" fill="#d99e82"></path><path d="M231.6304,153.81435c0,9.83892 -7.97614,17.81506 -17.81506,17.81506c-9.83892,0 -17.81506,-7.97614 -17.81506,-17.81506c0,-9.83892 7.97614,-17.81506 17.81506,-17.81506c9.83892,0 17.81506,7.97614 17.81506,17.81506z" fill="#fcb1e3"></path><path d="M229.16098,190.59288c-9.57565,-2.26111 -15.50524,-11.85671 -13.24412,-21.43235c2.26111,-9.57565 11.85671,-15.50524 21.43235,-13.24412c9.57565,2.26111 15.50524,11.85671 13.24412,21.43235c-2.26111,9.57565 -11.85671,15.50524 -21.43235,13.24412z" fill="#ffd983"></path><path d="M270.50321,192.68453c0,9.83892 -7.97878,17.81769 -17.81769,17.81769c-9.83892,0 -17.81506,-7.97878 -17.81506,-17.81769c0,-9.83892 7.97614,-17.81506 17.81506,-17.81506c9.83892,0 17.81769,7.97878 17.81769,17.81506z" fill="#a6d388"></path><path d="M280.76164,224.00071c-0.82849,0 -1.65698,-0.31661 -2.29021,-0.94721l-19.84141,-19.84141c-1.26648,-1.26384 -1.26648,-3.31657 0,-4.58041c1.26648,-1.26384 3.31393,-1.26384 4.58041,0l19.84141,19.84141c1.26384,1.26384 1.26384,3.31657 0,4.58041c-0.63324,0.62796 -1.46173,0.94721 -2.29021,0.94721z" fill="#d99e82"></path></g></g></svg>`
class Playground extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'downloadImage',
            'handleUpdateName',
            'handleUpdateImage',
            'onUploadImage'
        ]);
        // Append ?dir=rtl to URL to get RTL layout
        const match = location.search.match(/dir=([^&]+)/);
        const rtl = match && match[1] == 'rtl';
        this.id = 0;
        this.state = {
            name: 'dango',
            rotationCenterX: undefined,
            rotationCenterY: undefined,
            imageFormat: 'svg', // 'svg', 'png', or 'jpg'
            image: svgString, // svg string or data URI
            imageId: '' + this.id, // If this changes, the paint editor will reload
            rtl: rtl,
        };

        this.costumeFound = false
        this.reusableCanvas = document.createElement('canvas');

        const self = this;
        window.setSVGString = function(str) {
            self.setState({
                image: str,
                imageId: `${++self.id}`,
                rotationCenterX: undefined,
                rotationCenterY: undefined
            })
        }

        window.getSVGString = () => self.state.image

        window.getInternalPlaygroundComponent = () => self
        let loadedOldState = localStorage.getItem('savedState')
        if (loadedOldState) {
            this.costumeFound = true;
            this.state = {
                ...this.state,
                ...JSON.parse(loadedOldState)
            }
        }

        setTimeout(() => {
            self.rickroll = true
            self.forceUpdate()
        }, 10000)
    }
    handleUpdateName (name) {
        this.setState({name});
        localStorage.setItem("savedState", JSON.stringify(this.state))
    }
    handleUpdateImage (isVector, image, rotationCenterX, rotationCenterY) {
        this.setState({
            imageFormat: isVector ? 'svg' : 'png'
        });

        localStorage.setItem("savedState", JSON.stringify(this.state))
        if (!isVector) {
            console.log(`Image width: ${image.width}    Image height: ${image.height}`);
        }
        console.log(`rotationCenterX: ${rotationCenterX}    rotationCenterY: ${rotationCenterY}`);
        if (isVector) {
            this.setState({image, rotationCenterX, rotationCenterY});
        } else { // is Bitmap
            // image parameter has type ImageData
            // paint editor takes dataURI as input
            this.reusableCanvas.width = image.width;
            this.reusableCanvas.height = image.height;
            const context = this.reusableCanvas.getContext('2d');
            context.putImageData(image, 0, 0);
            this.setState({
                image: this.reusableCanvas.toDataURL('image/png'),
                rotationCenterX: rotationCenterX,
                rotationCenterY: rotationCenterY
            });
        }
    }
    downloadImage () {
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);

        const format = this.state.imageFormat;
        let data = this.state.image;
        if (format === 'png' || format === 'jpg') {
            data = this.b64toByteArray(data);
        } else {
            const doc = (new DOMParser()).parseFromString(data, 'text/html')

            doc.querySelector("svg").insertAdjacentHTML("beforeend", document.getElementById('scratch-font-styles').outerHTML)
            data = [doc.querySelector('svg').outerHTML];
        }
        const blob = new Blob(data, {type: format});
        const filename = `${this.state.name}.${format}`;
        if ('download' in HTMLAnchorElement.prototype) {
            const url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.type = blob.type;
            downloadLink.click();
            window.URL.revokeObjectURL(url);
        } else {
            // iOS Safari, open a new page and set href to data-uri
            let popup = window.open('', '_blank');
            const reader = new FileReader();
            reader.onloadend = function () {
                popup.location.href = reader.result;
                popup = null;
            };
            reader.readAsDataURL(blob);
        }
        document.body.removeChild(downloadLink);
    }
    b64toByteArray (b64Data, sliceSize=512) {
        // Remove header
        b64Data = b64Data.substring(b64Data.indexOf('base64,') + 7);

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return byteArrays;
    }
    uploadImage() {
        document.getElementById(styles.fileInput).click();
    }
    onUploadImage(event) {
        var file = event.target.files[0];
        var type = file.type === 'image/svg+xml' ? 'svg' :
            file.type === 'image/png' ? 'png' :
            file.type === 'image/jpg' ? 'jpg' :
            file.type === 'image/jpeg' ? 'jpg' :
            null;

        var reader = new FileReader();
        if (type === 'svg') {
            reader.readAsText(file,'UTF-8');
        } else if (type === 'png' || type === 'jpg'){
            reader.readAsDataURL(file);
        } else {
            alert("Couldn't read file type: " + file.type);
        }

        const that = this;
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!

            that.setState({
                image: content,
                name: file.name.split('.').slice(0, -1).join('.'),
                imageId: '' + (++that.id),
                imageFormat: type,
                rotationCenterX: undefined,
                rotationCenterY: undefined,
            });
       }
    }
    onCostumeClick(md5, name, url, type) {
        const playground = this;

        type = type || md5.split(".")[1].toLowerCase()

        fetch(url || `https://cdn.assets.scratch.mit.edu/internalapi/asset/${md5}/get/`).then(res => res.blob()).then(blob => {
            let reader = new FileReader()

            if (type === 'svg') {
                reader.readAsText(blob, 'UTF-8')
            } else if (type === 'png' || type === 'jpg') {
                reader.readAsDataURL(blob)
            } else alert("Couldn't read file type: " + type)

            reader.onloadend = (event) => {
                let image = event.target.result;


                playground.setState({
                    image,
                    name,
                    imageId: '' + ++playground.id,
                    imageFormat: type,
                    rotationCenterX: undefined,
                    rotationCenterY: undefined,
                });

                playground.costumeFound = true
                playground.forceUpdate()
            }
        })
    }
    render () {
        return (
            <div className={styles.wrapper}>
                <div>
                    {!this.costumeFound && 
                        <Modal
                            title="Choose your costume"
                        >
                            {costumes.map((costume, index) => {
                                return (
                                    <LibraryItemComponent
                                    md5ext={costume.md5ext}
                                    key={index}
                                    onClick={this.onCostumeClick.bind(this)}
                                    name={costume.name}
                                    url={costume.url}
                                    type={costume.dataFormat}
                                    />
                                )
                            })}
                        </Modal>
                    }
                    <PaintEditor
                        {...this.state}
                        onUpdateName={this.handleUpdateName}
                        onUpdateImage={this.handleUpdateImage}
                    />
                    <Button2Component className={styles.playgroundButton}  onClick={this.uploadImage}>Upload</Button2Component>
                    <input id={styles.fileInput} type="file" name="name" onChange={this.onUploadImage} />
                    <Button2Component className={styles.playgroundButton} onClick={this.downloadImage}>Download</Button2Component>
                    <Button2Component className={styles.playgroundButton} onClick={() => {
                        this.costumeFound = false;
                        this.setState({
                            imageId: "-1",
                            image: "",
                            name: ""
                        })
                        this.forceUpdate()
                    }}>Reload</Button2Component>
                    <Button2Component className={styles.playgroundButton} onClick={() => {

                        const format = this.state.imageFormat;
                        let data = this.state.image;
                        if (format === 'png' || format === 'jpg') {
                            data = this.b64toByteArray(data);
                        } else {
                            const doc = (new DOMParser()).parseFromString(data, 'text/html')

                            doc.querySelector("svg").insertAdjacentHTML("beforeend", document.getElementById('scratch-font-styles').outerHTML)
                            data = [doc.querySelector('svg').outerHTML];
                        }
                        const blob = new Blob(data, {type: format});
                        
                        const reader = new FileReader()

                        reader.readAsDataURL(blob)

                        reader.onload = (e) => {
                            navigator.clipboard.writeText(e.target.result)
                        }

                        reader.onerror = (ex) => alert("Your request to get a dataURL could not be fulfilled.\nError:\n\n" + ex)
                    }}>Get DataURL</Button2Component>
                </div> 
                <iframe src="https://youtube.com/embed/dQw4w9WgXcQ/?autoplay" autoplay style={{
                    width: "100vw",
                    height: "100vh",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderWidth: "0px",
                    display: getInternalPlaygroundComponent().rickroll ? "block" : "none",
                    zIndex: 1000000000
                    // "position: fixed; width: 100vw; height: 100vh;"
                }}></iframe>
            </div>
        );
    }

}
ReactDOM.render((
    <Provider store={store}>
        <IntlProvider>
            <Playground />
        </IntlProvider>
    </Provider>
), appTarget);
