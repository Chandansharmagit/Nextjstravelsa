const SkeletonCard = ({ featured = false }: { featured?: boolean }) => (
    <div className={`${featured ? 'h-[500px]' : 'h-[400px]'} rounded-2xl bg-gray-200 animate-pulse overflow-hidden`}>
        <div className="h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
    </div>
);

export default SkeletonCard;
