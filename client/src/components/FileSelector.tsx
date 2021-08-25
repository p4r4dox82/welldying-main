import * as React from 'react';

function FileSelector() {
  let [state, setState] = React.useState<any>(null);
  function handleFileinput(e: any) {
    setState({
      selectedFile : e.target.files[0],
    });
  }
  let handlePost  = async () => {
    let formData = new FormData();
    formData.append('image', state.selectedFile);

    for(let key of formData.keys()) {
      console.log(key);
    }
    for(let value of formData.values()) {
      console.log(value);
    }
  }
  return (
  <div>
      <input type = 'file' name = 'file' onChange={e => {handleFileinput(e)}} />
      <button type = 'button' onClick = { () => {handlePost()}} />
  </div>
  );
};

export default FileSelector;
