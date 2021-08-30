import * as React from 'react';
import { uploadImage_formdata } from '../etc/api/image';

interface Props {
  setImageUri: any;
  imageUri: string;
}

function FileSelector(props: Props) {
  let [state, setState] = React.useState<any>(null);
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


  let img = React.useMemo(() => (
    <img src = {`${imageUrl}`} />
  ), [imageUrl]);

  let input_file = React.useRef<any>(null);


  return (
  <div className = 'fileSelector'>
      <button className = 'image_input' onClick = {() => {handleClick();}} >
      {img}
      </button>
      <input type = 'file' onChange={e => {handleFileinput(e)}} style = {{display: 'none'}} ref = {input_file}/>
  </div>
  );
};

export default FileSelector;
