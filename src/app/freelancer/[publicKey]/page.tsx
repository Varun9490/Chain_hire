import FreelancerInfoFeature from '@/components/freelancer/freelancer-info-feature';

interface Params {
  params: { publicKey: string };
}

export default function FreelancerDetailPage({ params }: Params) {
  const { publicKey } = params;
  return <FreelancerInfoFeature account={publicKey} />;
}
