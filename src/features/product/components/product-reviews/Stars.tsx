import starIcon from './assets/star.svg';

// Decorative row of 5 filled stars; the numeric rating is always shown as text next to it.
function Stars() {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <img key={i} src={starIcon} alt="" width={20} height={20} />
      ))}
    </div>
  );
}

export default Stars;
