import { editIcon, checkIcon } from "../../Icons";

export default function EditButton({ element, editing, setEditing }) {
  const enterEditMode = () => {
    setEditing({ ...editing, [element]: true });
  };

  return editing[element] === false ? (
    <i onClick={enterEditMode} key={1}>
      {editIcon}
    </i>
  ) : (
    <button type="submit" key={0} className="btn btn-outline-primary">
      <i type="submit">{checkIcon}</i>
    </button>
  );
  // return editing[element] === true ? (
  //   <button type="submit" key={0}>
  //     Apply
  //   </button>
  // ) : (
  //   <button type="button" onClick={enterEditMode} key={1}>
  //     Edit
  //   </button>
  // );
}
