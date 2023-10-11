export default function EditableImage({ element, userData, displayName }) {
  return (
    <>
      <label>{displayName}</label>
      <img src={userData[element]} alt="" Profile Picture />
    </>
  );
}
