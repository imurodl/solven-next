import React from 'react';

export const CarCardSkeleton = () => (
	<div className="slv-skel-card">
		<div className="slv-skeleton slv-skel-img" />
		<div className="slv-skeleton slv-skel-line" />
		<div className="slv-skeleton slv-skel-line short" />
		<div className="slv-skeleton slv-skel-line price" />
	</div>
);

export const AgentCardSkeleton = () => (
	<div className="slv-skel-card agent">
		<div className="slv-skeleton slv-skel-img" />
		<div className="slv-skeleton slv-skel-line short" />
		<div className="slv-skeleton slv-skel-line" />
	</div>
);

export const RowSkeleton = () => (
	<div className="slv-skel-card row">
		<div className="slv-skeleton slv-skel-img" />
		<div className="slv-skel-body">
			<div className="slv-skeleton slv-skel-line" />
			<div className="slv-skeleton slv-skel-line short" />
		</div>
	</div>
);

export const SkeletonGrid = ({ count = 6, kind = 'car' }: { count?: number; kind?: 'car' | 'agent' | 'row' }) => (
	<div className="slv-skel-grid">
		{Array.from({ length: count }).map((_, i) =>
			kind === 'agent' ? <AgentCardSkeleton key={i} /> : kind === 'row' ? <RowSkeleton key={i} /> : <CarCardSkeleton key={i} />,
		)}
	</div>
);
