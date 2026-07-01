import "./profileCard.css";

export default function ProfileCard({
  image,
  name,
  description,
  selected,
  onSelect,
}) {
  return (
    <div
      className={`profile-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    > 

      <div className="profile-card-image">
        <img src={image} alt={name} />
      </div>
      <span className="profile-card-name">{name}</span>
      <span className="profile-card-desc">
        {description}
      </span>
    </div>
  );
}