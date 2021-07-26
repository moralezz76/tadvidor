import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { Ability } from '@casl/ability';

export const ability = new Ability([]);
const AbilityContext = createContext(ability);
export const Can = createContextualCan(AbilityContext.Consumer);

export const userHavePermissions = (permissions: Permission | Permission[]) => {
  const permissionsToArray = Array.isArray(permissions) ? permissions : [permissions];
  return Object.values(permissionsToArray).some(permission =>
    ability.can(permission.actions, permission.subject)
  );
};

export class Permission {
  _subject: string;
  _actions: string;

  constructor(subject: string, action: string) {
    this._subject = subject.toLowerCase();
    this._actions = action.toLowerCase();
  }
  get subject(): string {
    return this._subject;
  }
  get actions(): string {
    return this._actions;
  }
}

export default AbilityContext;
