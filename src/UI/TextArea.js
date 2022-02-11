const TextArea = (props) => {
  return (
    <textarea style={props.style} placeholder={props.placeholder}>
      {props.text}
    </textarea>
  );
};

export default TextArea;
