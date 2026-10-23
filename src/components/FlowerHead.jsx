export default function FlowerHead({ className = "", petals = 5 }) {
  return (
    <svg className={className} viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <g fill="currentColor">
        {Array.from({ length: petals }).map((_, index) => (
          <ellipse
            key={index}
            cx="22"
            cy="11.5"
            rx="6.3"
            ry="9"
            opacity={0.78 + (index % 3) * 0.07}
            transform={`rotate(${(360 / petals) * index} 22 22)`}
          />
        ))}
      </g>
      <circle cx="22" cy="22" r="4.1" fill="var(--flower-center, #dce5bf)" />
      <circle cx="22" cy="22" r="1.4" fill="rgba(58, 84, 58, 0.45)" />
    </svg>
  );
}
