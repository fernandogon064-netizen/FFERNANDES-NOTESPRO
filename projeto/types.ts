
export enum Category {
  NEGOCIOS = 'Negócios',
  IDEIAS_VIDEO = 'Ideias de Vídeos',
  PROJETOS = 'Projetos',
  METAS = 'Metas',
  ESTUDOS = 'Estudos',
  OUTROS = 'Outros'
}

export enum Priority {
  ALTA = 'Alta',
  MEDIA = 'Média',
  BAIXA = 'Baixa'
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  priority: Priority;
  dateCreated: string;
  deadline?: string;
  image?: string; // base64
  videoLink?: string;
  links: string[];
  checklist: ChecklistItem[];
  isPinned: boolean;
  color?: string; // Added custom color property
  isBold?: boolean; // Novo campo para negrito
  fontSize?: string; // Novo campo para tamanho da fonte
}

export interface MonthlyGoal {
  id: string;
  text: string;
  completed: boolean;
}
