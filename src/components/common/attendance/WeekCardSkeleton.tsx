interface WeekCardsSkeletonProps {
  count?: number;
}

const WeekCardsSkeleton = ({ count = 3 }: WeekCardsSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-11 w-28 rounded-xl bg-slate-100 animate-pulse"
        />
      ))}
    </>
  );
};

export default WeekCardsSkeleton;
