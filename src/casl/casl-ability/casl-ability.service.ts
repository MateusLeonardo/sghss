import { Injectable, Scope } from '@nestjs/common';
import { AbilityBuilder, PureAbility, Subject } from '@casl/ability';
import { User, Role, Patient, Doctor, Attendant } from '@prisma/client';

export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type PermissionResource =
  | 'Appointment'
  | 'MedicalRecord'
  | 'User'
  | 'Patient'
  | 'Doctor'
  | 'Attendant'
  | 'all';

export type AppAbility = PureAbility<[PermActions, PermissionResource]>;

type PermissionHandler = (
  user: User & { patient?: Patient; doctor?: Doctor; attendant?: Attendant },
  builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissionsMap: Record<Role, PermissionHandler> = {
  [Role.ADMIN]: (user, { can }) => {
    can('manage', 'all');
  },

  [Role.DOCTOR]: (user, { can }) => {
    if(!user.doctor) return;
    can(['read', 'update'], 'Appointment', { doctorId: user.doctor?.id });
    can('create', 'MedicalRecord');
    can(['read', 'update'], 'MedicalRecord', { doctorId: user.doctor?.id });
    can('read', 'Patient');
  },

  [Role.PATIENT]: (user, { can, cannot }) => {
    if(!user.patient) return;
    // can('read', 'Appointment', { patientId: user.patient?.id });
    cannot('create', 'User')
  },

  [Role.ATTENDANT]: (user, { can }) => {
    if(!user.attendant) return;
    can(['read', 'update'], 'Appointment', { attendantId: user.attendant?.id });
    can('read', 'Patient');
  },
};

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityService {
  ability: AppAbility;

  createForUser(
    user: User & { patient?: Patient; doctor?: Doctor; attendant?: Attendant },
  ): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(PureAbility);

    const conditionsMatcher = (conditions: any) => (subject: Subject) => {
      if (typeof conditions === 'function') return conditions(subject);

      return Object.keys(conditions).every((key) => {

        if (key.endsWith('Id') && subject[key] !== undefined) {
          return subject[key] === conditions[key];
        }
        return subject[key] === conditions[key];
      });
    };

    rolePermissionsMap[user.role]?.(user, builder);

    this.ability = builder.build({ conditionsMatcher });
    return this.ability;
  }
}
