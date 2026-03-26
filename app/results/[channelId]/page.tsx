import ResultsClient from "./ResultsClient";

interface Props {
  params: { channelId: string };
}

export default function ResultsPage({ params }: Props) {
  return <ResultsClient channelId={decodeURIComponent(params.channelId)} />;
}
