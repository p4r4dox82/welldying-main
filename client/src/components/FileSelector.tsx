import * as React from 'react';
import { uploadImage_formdata } from '../etc/api/image';

function FileSelector() {
  let [state, setState] = React.useState<any>(null);
  function handleFileinput(e: any) {
    setState({
      selectedFile : e.target.files[0],
    });
  }
  let [imageUrl, setImageUrl] = React.useState<string>('');
  let handlePost  = async () => {
    let formData = new FormData();
    formData.append('image', state.selectedFile);

    const s3Uri = await uploadImage_formdata(formData);
    console.log(s3Uri);
    setImageUrl(s3Uri);
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
  <div style = {{height: '150px', marginTop: '53px'}}>
      <button className = 'image_input' onClick = {() => {handleClick();}} >
      {img}
      </button>
      <input type = 'file' onChange={e => {handleFileinput(e)}} style = {{display: 'none'}} ref = {input_file}/>
      <button type = 'button' onClick = { () => {handlePost();}} />
  </div>
  );
};

export default FileSelector;
