export type Copy<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key]
}