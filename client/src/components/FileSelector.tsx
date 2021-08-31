import * as React from 'react';
import { uploadImage_formdata } from '../etc/api/image';
import ReactCrop from 'react-image-crop';

interface Props {
  setImageUri: any;
  imageUri: string;
}

function FileSelector(props: Props) {
  let input_file = React.useRef<any>(null);
  let [state, setState] = React.useState<any>({ image: '', imageLoaded: false });
  let [imageUrl, setImageUrl] = React.useState<string>('https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png');
  if(props.imageUri !== '' && props.imageUri !== imageUrl)
    setImageUrl(props.imageUri);
  let setImageUri = (imageUri: string) => {
    props.setImageUri(imageUri);
  }
  let handleFileinput  = async (e: any) => {
    let formData = new FormData();
    formData.append('image', e.target.files[0]);

    const s3Uri = await uploadImage_formdata(formData);
    console.log(s3Uri);
    setImageUrl(s3Uri);
    setImageUri(s3Uri);
    if(s3Uri === undefined) {
      setImageUrl('https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png');
    }
    return s3Uri;
  }
  let handleClick = () => {
    input_file.current.click();
  };

  const [crop, setCrop] = React.useState<{
    unit: "px" | "%",
    x: number,
    y: number,
    width: number,
    height: number,
  }>({
    unit: "px",
    x: 0,
    y: 0,
    width: 500,
    height: 300,
  });


  let img = React.useMemo(() => {
    return (
      <>
        <img src = {imageUrl} />
      </>
    );
  }, [imageUrl]);


  return (
      <>
        <div className = 'fileSelector'>
            <button className = 'image_input' onClick = {() => {handleClick();}} >
            <div className = 'new_image' style = {{width: crop.width, height: crop.height, overflow: 'hidden'}}>
                <img className = 'new_image' src = {imageUrl} style = {{left: -crop.x, top: -crop.y, objectFit: 'none'}}/>
            </div>
            </button>
            <input type = 'file' onChange={e => {handleFileinput(e)}} style = {{display: 'none'}} ref = {input_file}/>
        </div>
        <div className = 'React_Crop'>
            <ReactCrop className = 'Crop' src = {imageUrl} crop = {crop} onChange = {(newCrop) => {
              let changeCrop = newCrop;
              setCrop(changeCrop);
            }} locked style = {{width: 'fit-content', height: 'fit-content', objectFit: 'cover', minHeight: '410px'}}/>
        </div>
      </>
  );
};

export default FileSelector;
