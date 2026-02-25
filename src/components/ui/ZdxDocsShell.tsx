// src/components/ui/ZdxDocsShell.tsx

export type StatusTone =
  | 'default'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

export type ZdxHeaderProps = {
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    tone?: StatusTone;
  };
};

type Props = {
  children: React.ReactNode;
  className?: string;
  containerClass?: string;
  showFrame?: boolean;
  showQuickLinks?: boolean;

  /** ✅ ADD THIS */
  headerProps?: ZdxHeaderProps;
};
