import React from 'react';
import { View } from 'react-native';
import SkeletonCard from '@/components/common/Skeleton';
import { ErrorState, EmptyState } from '@/components/common/StateView';
import { useHomeTheme } from '@/context/ThemeContext';

export default function ScreenStateWrapper({
  loading,
  error,
  isEmpty,
  onRetry,
  skeletonCount = 3,
  renderSkeleton,
  emptyTitle = "Koi data nahi milna",
  emptySubtitle = "Yahan abhi kuch show karne ke liye nahi hai.",
  emptyIcon = "document-text-outline",
  children,
}) {
  const { colors } = useHomeTheme();

  if (loading) {
    return (
      <View style={{ paddingHorizontal: 20, paddingTop: 4, gap: 12 }}>
        {Array.from({ length: skeletonCount }).map((_, i) =>
          renderSkeleton ? (
            <View key={i}>{renderSkeleton()}</View>
          ) : (
            <SkeletonCard key={i} width="100%" height={72} borderRadius={18} />
          )
        )}
      </View>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Kuch problem ho gayi"
        subtitle="Network check karke dobara try karein."
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return <>{children}</>;
}