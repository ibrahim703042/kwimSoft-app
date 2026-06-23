export type RegisteredModule = { name: string };

let getModulesFn: () => RegisteredModule[] = () => [];

export function configureAdminArea(ctx: { getModules: () => RegisteredModule[] }) {
  getModulesFn = ctx.getModules;
}

export function getRegisteredModules(): RegisteredModule[] {
  return getModulesFn();
}
