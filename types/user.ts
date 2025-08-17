import type { TrackedType } from './tracked';

export interface User extends TrackedType {
  id: number;
  name: string;
}
