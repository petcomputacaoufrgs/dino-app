export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface DinoTabPanelProps {
  panels: { name: string, Component: React.ReactNode }[],
}