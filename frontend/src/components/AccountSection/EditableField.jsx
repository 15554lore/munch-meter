export default function EditableField({
  element,
  editing,
  userData,
  displayName,
  className,
}) {
  return (
    <>
      <label>{displayName}</label>
      {editing[element] === true ? (
        <input
          className={className}
          name="inputBox"
          type="text"
          defaultValue={userData[element]}
          key={0}
          style={{
            background: "transparent",
            border: "none transparent",
            outline: "none",
            color: "#FFFFFF",
            textAlign: "center",
          }}
          maxLength={element === "username" ? "16" : "258"}
        />
      ) : (
        <span className={className} key={1}>
          {[element] in userData
            ? userData[element]
            : `${displayName} Not Found`}
        </span>
      )}
    </>
  );
}
