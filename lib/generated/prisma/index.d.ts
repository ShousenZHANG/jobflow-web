
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Job
 * 
 */
export type Job = $Result.DefaultSelection<Prisma.$JobPayload>
/**
 * Model DeletedJobUrl
 * 
 */
export type DeletedJobUrl = $Result.DefaultSelection<Prisma.$DeletedJobUrlPayload>
/**
 * Model DailyCheckin
 * 
 */
export type DailyCheckin = $Result.DefaultSelection<Prisma.$DailyCheckinPayload>
/**
 * Model SavedSearch
 * 
 */
export type SavedSearch = $Result.DefaultSelection<Prisma.$SavedSearchPayload>
/**
 * Model FetchRun
 * 
 */
export type FetchRun = $Result.DefaultSelection<Prisma.$FetchRunPayload>
/**
 * Model ResumeProfile
 * 
 */
export type ResumeProfile = $Result.DefaultSelection<Prisma.$ResumeProfilePayload>
/**
 * Model AiPromptProfile
 * 
 */
export type AiPromptProfile = $Result.DefaultSelection<Prisma.$AiPromptProfilePayload>
/**
 * Model UserAiProviderConfig
 * 
 */
export type UserAiProviderConfig = $Result.DefaultSelection<Prisma.$UserAiProviderConfigPayload>
/**
 * Model Application
 * 
 */
export type Application = $Result.DefaultSelection<Prisma.$ApplicationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const JobStatus: {
  NEW: 'NEW',
  APPLIED: 'APPLIED',
  REJECTED: 'REJECTED'
};

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus]


export const FetchRunStatus: {
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED'
};

export type FetchRunStatus = (typeof FetchRunStatus)[keyof typeof FetchRunStatus]


export const AiProvider: {
  OPENAI: 'OPENAI',
  GEMINI: 'GEMINI',
  CLAUDE: 'CLAUDE'
};

export type AiProvider = (typeof AiProvider)[keyof typeof AiProvider]

}

export type JobStatus = $Enums.JobStatus

export const JobStatus: typeof $Enums.JobStatus

export type FetchRunStatus = $Enums.FetchRunStatus

export const FetchRunStatus: typeof $Enums.FetchRunStatus

export type AiProvider = $Enums.AiProvider

export const AiProvider: typeof $Enums.AiProvider

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.job`: Exposes CRUD operations for the **Job** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jobs
    * const jobs = await prisma.job.findMany()
    * ```
    */
  get job(): Prisma.JobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deletedJobUrl`: Exposes CRUD operations for the **DeletedJobUrl** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeletedJobUrls
    * const deletedJobUrls = await prisma.deletedJobUrl.findMany()
    * ```
    */
  get deletedJobUrl(): Prisma.DeletedJobUrlDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dailyCheckin`: Exposes CRUD operations for the **DailyCheckin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailyCheckins
    * const dailyCheckins = await prisma.dailyCheckin.findMany()
    * ```
    */
  get dailyCheckin(): Prisma.DailyCheckinDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.savedSearch`: Exposes CRUD operations for the **SavedSearch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SavedSearches
    * const savedSearches = await prisma.savedSearch.findMany()
    * ```
    */
  get savedSearch(): Prisma.SavedSearchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fetchRun`: Exposes CRUD operations for the **FetchRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FetchRuns
    * const fetchRuns = await prisma.fetchRun.findMany()
    * ```
    */
  get fetchRun(): Prisma.FetchRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resumeProfile`: Exposes CRUD operations for the **ResumeProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ResumeProfiles
    * const resumeProfiles = await prisma.resumeProfile.findMany()
    * ```
    */
  get resumeProfile(): Prisma.ResumeProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiPromptProfile`: Exposes CRUD operations for the **AiPromptProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiPromptProfiles
    * const aiPromptProfiles = await prisma.aiPromptProfile.findMany()
    * ```
    */
  get aiPromptProfile(): Prisma.AiPromptProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userAiProviderConfig`: Exposes CRUD operations for the **UserAiProviderConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAiProviderConfigs
    * const userAiProviderConfigs = await prisma.userAiProviderConfig.findMany()
    * ```
    */
  get userAiProviderConfig(): Prisma.UserAiProviderConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.application`: Exposes CRUD operations for the **Application** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Applications
    * const applications = await prisma.application.findMany()
    * ```
    */
  get application(): Prisma.ApplicationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Account: 'Account',
    Session: 'Session',
    Job: 'Job',
    DeletedJobUrl: 'DeletedJobUrl',
    DailyCheckin: 'DailyCheckin',
    SavedSearch: 'SavedSearch',
    FetchRun: 'FetchRun',
    ResumeProfile: 'ResumeProfile',
    AiPromptProfile: 'AiPromptProfile',
    UserAiProviderConfig: 'UserAiProviderConfig',
    Application: 'Application'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "account" | "session" | "job" | "deletedJobUrl" | "dailyCheckin" | "savedSearch" | "fetchRun" | "resumeProfile" | "aiPromptProfile" | "userAiProviderConfig" | "application"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Job: {
        payload: Prisma.$JobPayload<ExtArgs>
        fields: Prisma.JobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findFirst: {
            args: Prisma.JobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findMany: {
            args: Prisma.JobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          create: {
            args: Prisma.JobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          createMany: {
            args: Prisma.JobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          delete: {
            args: Prisma.JobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          update: {
            args: Prisma.JobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          deleteMany: {
            args: Prisma.JobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          upsert: {
            args: Prisma.JobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          aggregate: {
            args: Prisma.JobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob>
          }
          groupBy: {
            args: Prisma.JobGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobCountArgs<ExtArgs>
            result: $Utils.Optional<JobCountAggregateOutputType> | number
          }
        }
      }
      DeletedJobUrl: {
        payload: Prisma.$DeletedJobUrlPayload<ExtArgs>
        fields: Prisma.DeletedJobUrlFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeletedJobUrlFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeletedJobUrlFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload>
          }
          findFirst: {
            args: Prisma.DeletedJobUrlFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeletedJobUrlFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload>
          }
          findMany: {
            args: Prisma.DeletedJobUrlFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload>[]
          }
          create: {
            args: Prisma.DeletedJobUrlCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload>
          }
          createMany: {
            args: Prisma.DeletedJobUrlCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeletedJobUrlCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload>[]
          }
          delete: {
            args: Prisma.DeletedJobUrlDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload>
          }
          update: {
            args: Prisma.DeletedJobUrlUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload>
          }
          deleteMany: {
            args: Prisma.DeletedJobUrlDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeletedJobUrlUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeletedJobUrlUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload>[]
          }
          upsert: {
            args: Prisma.DeletedJobUrlUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeletedJobUrlPayload>
          }
          aggregate: {
            args: Prisma.DeletedJobUrlAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeletedJobUrl>
          }
          groupBy: {
            args: Prisma.DeletedJobUrlGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeletedJobUrlGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeletedJobUrlCountArgs<ExtArgs>
            result: $Utils.Optional<DeletedJobUrlCountAggregateOutputType> | number
          }
        }
      }
      DailyCheckin: {
        payload: Prisma.$DailyCheckinPayload<ExtArgs>
        fields: Prisma.DailyCheckinFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailyCheckinFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailyCheckinFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload>
          }
          findFirst: {
            args: Prisma.DailyCheckinFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailyCheckinFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload>
          }
          findMany: {
            args: Prisma.DailyCheckinFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload>[]
          }
          create: {
            args: Prisma.DailyCheckinCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload>
          }
          createMany: {
            args: Prisma.DailyCheckinCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailyCheckinCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload>[]
          }
          delete: {
            args: Prisma.DailyCheckinDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload>
          }
          update: {
            args: Prisma.DailyCheckinUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload>
          }
          deleteMany: {
            args: Prisma.DailyCheckinDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailyCheckinUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DailyCheckinUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload>[]
          }
          upsert: {
            args: Prisma.DailyCheckinUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyCheckinPayload>
          }
          aggregate: {
            args: Prisma.DailyCheckinAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailyCheckin>
          }
          groupBy: {
            args: Prisma.DailyCheckinGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailyCheckinGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailyCheckinCountArgs<ExtArgs>
            result: $Utils.Optional<DailyCheckinCountAggregateOutputType> | number
          }
        }
      }
      SavedSearch: {
        payload: Prisma.$SavedSearchPayload<ExtArgs>
        fields: Prisma.SavedSearchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SavedSearchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SavedSearchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload>
          }
          findFirst: {
            args: Prisma.SavedSearchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SavedSearchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload>
          }
          findMany: {
            args: Prisma.SavedSearchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload>[]
          }
          create: {
            args: Prisma.SavedSearchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload>
          }
          createMany: {
            args: Prisma.SavedSearchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SavedSearchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload>[]
          }
          delete: {
            args: Prisma.SavedSearchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload>
          }
          update: {
            args: Prisma.SavedSearchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload>
          }
          deleteMany: {
            args: Prisma.SavedSearchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SavedSearchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SavedSearchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload>[]
          }
          upsert: {
            args: Prisma.SavedSearchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedSearchPayload>
          }
          aggregate: {
            args: Prisma.SavedSearchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSavedSearch>
          }
          groupBy: {
            args: Prisma.SavedSearchGroupByArgs<ExtArgs>
            result: $Utils.Optional<SavedSearchGroupByOutputType>[]
          }
          count: {
            args: Prisma.SavedSearchCountArgs<ExtArgs>
            result: $Utils.Optional<SavedSearchCountAggregateOutputType> | number
          }
        }
      }
      FetchRun: {
        payload: Prisma.$FetchRunPayload<ExtArgs>
        fields: Prisma.FetchRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FetchRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FetchRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload>
          }
          findFirst: {
            args: Prisma.FetchRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FetchRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload>
          }
          findMany: {
            args: Prisma.FetchRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload>[]
          }
          create: {
            args: Prisma.FetchRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload>
          }
          createMany: {
            args: Prisma.FetchRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FetchRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload>[]
          }
          delete: {
            args: Prisma.FetchRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload>
          }
          update: {
            args: Prisma.FetchRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload>
          }
          deleteMany: {
            args: Prisma.FetchRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FetchRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FetchRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload>[]
          }
          upsert: {
            args: Prisma.FetchRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchRunPayload>
          }
          aggregate: {
            args: Prisma.FetchRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFetchRun>
          }
          groupBy: {
            args: Prisma.FetchRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<FetchRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.FetchRunCountArgs<ExtArgs>
            result: $Utils.Optional<FetchRunCountAggregateOutputType> | number
          }
        }
      }
      ResumeProfile: {
        payload: Prisma.$ResumeProfilePayload<ExtArgs>
        fields: Prisma.ResumeProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResumeProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResumeProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload>
          }
          findFirst: {
            args: Prisma.ResumeProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResumeProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload>
          }
          findMany: {
            args: Prisma.ResumeProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload>[]
          }
          create: {
            args: Prisma.ResumeProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload>
          }
          createMany: {
            args: Prisma.ResumeProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResumeProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload>[]
          }
          delete: {
            args: Prisma.ResumeProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload>
          }
          update: {
            args: Prisma.ResumeProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload>
          }
          deleteMany: {
            args: Prisma.ResumeProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResumeProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResumeProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload>[]
          }
          upsert: {
            args: Prisma.ResumeProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeProfilePayload>
          }
          aggregate: {
            args: Prisma.ResumeProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResumeProfile>
          }
          groupBy: {
            args: Prisma.ResumeProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResumeProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResumeProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ResumeProfileCountAggregateOutputType> | number
          }
        }
      }
      AiPromptProfile: {
        payload: Prisma.$AiPromptProfilePayload<ExtArgs>
        fields: Prisma.AiPromptProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiPromptProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiPromptProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload>
          }
          findFirst: {
            args: Prisma.AiPromptProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiPromptProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload>
          }
          findMany: {
            args: Prisma.AiPromptProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload>[]
          }
          create: {
            args: Prisma.AiPromptProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload>
          }
          createMany: {
            args: Prisma.AiPromptProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiPromptProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload>[]
          }
          delete: {
            args: Prisma.AiPromptProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload>
          }
          update: {
            args: Prisma.AiPromptProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload>
          }
          deleteMany: {
            args: Prisma.AiPromptProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiPromptProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiPromptProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload>[]
          }
          upsert: {
            args: Prisma.AiPromptProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPromptProfilePayload>
          }
          aggregate: {
            args: Prisma.AiPromptProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiPromptProfile>
          }
          groupBy: {
            args: Prisma.AiPromptProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiPromptProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiPromptProfileCountArgs<ExtArgs>
            result: $Utils.Optional<AiPromptProfileCountAggregateOutputType> | number
          }
        }
      }
      UserAiProviderConfig: {
        payload: Prisma.$UserAiProviderConfigPayload<ExtArgs>
        fields: Prisma.UserAiProviderConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAiProviderConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAiProviderConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload>
          }
          findFirst: {
            args: Prisma.UserAiProviderConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAiProviderConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload>
          }
          findMany: {
            args: Prisma.UserAiProviderConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload>[]
          }
          create: {
            args: Prisma.UserAiProviderConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload>
          }
          createMany: {
            args: Prisma.UserAiProviderConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserAiProviderConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload>[]
          }
          delete: {
            args: Prisma.UserAiProviderConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload>
          }
          update: {
            args: Prisma.UserAiProviderConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload>
          }
          deleteMany: {
            args: Prisma.UserAiProviderConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAiProviderConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserAiProviderConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload>[]
          }
          upsert: {
            args: Prisma.UserAiProviderConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderConfigPayload>
          }
          aggregate: {
            args: Prisma.UserAiProviderConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAiProviderConfig>
          }
          groupBy: {
            args: Prisma.UserAiProviderConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAiProviderConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserAiProviderConfigCountArgs<ExtArgs>
            result: $Utils.Optional<UserAiProviderConfigCountAggregateOutputType> | number
          }
        }
      }
      Application: {
        payload: Prisma.$ApplicationPayload<ExtArgs>
        fields: Prisma.ApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findFirst: {
            args: Prisma.ApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findMany: {
            args: Prisma.ApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          create: {
            args: Prisma.ApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          createMany: {
            args: Prisma.ApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          delete: {
            args: Prisma.ApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          update: {
            args: Prisma.ApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          deleteMany: {
            args: Prisma.ApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          upsert: {
            args: Prisma.ApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          aggregate: {
            args: Prisma.ApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplication>
          }
          groupBy: {
            args: Prisma.ApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<ApplicationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    account?: AccountOmit
    session?: SessionOmit
    job?: JobOmit
    deletedJobUrl?: DeletedJobUrlOmit
    dailyCheckin?: DailyCheckinOmit
    savedSearch?: SavedSearchOmit
    fetchRun?: FetchRunOmit
    resumeProfile?: ResumeProfileOmit
    aiPromptProfile?: AiPromptProfileOmit
    userAiProviderConfig?: UserAiProviderConfigOmit
    application?: ApplicationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
    jobs: number
    savedSearches: number
    fetchRuns: number
    deletedJobUrls: number
    dailyCheckins: number
    resumeProfiles: number
    applications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    jobs?: boolean | UserCountOutputTypeCountJobsArgs
    savedSearches?: boolean | UserCountOutputTypeCountSavedSearchesArgs
    fetchRuns?: boolean | UserCountOutputTypeCountFetchRunsArgs
    deletedJobUrls?: boolean | UserCountOutputTypeCountDeletedJobUrlsArgs
    dailyCheckins?: boolean | UserCountOutputTypeCountDailyCheckinsArgs
    resumeProfiles?: boolean | UserCountOutputTypeCountResumeProfilesArgs
    applications?: boolean | UserCountOutputTypeCountApplicationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSavedSearchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedSearchWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFetchRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FetchRunWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDeletedJobUrlsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeletedJobUrlWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDailyCheckinsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyCheckinWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountResumeProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeProfileWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }


  /**
   * Count Type JobCountOutputType
   */

  export type JobCountOutputType = {
    applications: number
  }

  export type JobCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | JobCountOutputTypeCountApplicationsArgs
  }

  // Custom InputTypes
  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobCountOutputType
     */
    select?: JobCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }


  /**
   * Count Type ResumeProfileCountOutputType
   */

  export type ResumeProfileCountOutputType = {
    applications: number
  }

  export type ResumeProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | ResumeProfileCountOutputTypeCountApplicationsArgs
  }

  // Custom InputTypes
  /**
   * ResumeProfileCountOutputType without action
   */
  export type ResumeProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfileCountOutputType
     */
    select?: ResumeProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ResumeProfileCountOutputType without action
   */
  export type ResumeProfileCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    image: string | null
    emailVerified: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    image: string | null
    emailVerified: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    image: number
    emailVerified: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    image?: true
    emailVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    image?: true
    emailVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    image?: true
    emailVerified?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string | null
    name: string | null
    image: string | null
    emailVerified: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    image?: boolean
    emailVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    jobs?: boolean | User$jobsArgs<ExtArgs>
    savedSearches?: boolean | User$savedSearchesArgs<ExtArgs>
    fetchRuns?: boolean | User$fetchRunsArgs<ExtArgs>
    deletedJobUrls?: boolean | User$deletedJobUrlsArgs<ExtArgs>
    dailyCheckins?: boolean | User$dailyCheckinsArgs<ExtArgs>
    resumeProfiles?: boolean | User$resumeProfilesArgs<ExtArgs>
    aiPromptProfile?: boolean | User$aiPromptProfileArgs<ExtArgs>
    aiProviderConfig?: boolean | User$aiProviderConfigArgs<ExtArgs>
    applications?: boolean | User$applicationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    image?: boolean
    emailVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    image?: boolean
    emailVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    image?: boolean
    emailVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "image" | "emailVerified" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    jobs?: boolean | User$jobsArgs<ExtArgs>
    savedSearches?: boolean | User$savedSearchesArgs<ExtArgs>
    fetchRuns?: boolean | User$fetchRunsArgs<ExtArgs>
    deletedJobUrls?: boolean | User$deletedJobUrlsArgs<ExtArgs>
    dailyCheckins?: boolean | User$dailyCheckinsArgs<ExtArgs>
    resumeProfiles?: boolean | User$resumeProfilesArgs<ExtArgs>
    aiPromptProfile?: boolean | User$aiPromptProfileArgs<ExtArgs>
    aiProviderConfig?: boolean | User$aiProviderConfigArgs<ExtArgs>
    applications?: boolean | User$applicationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      jobs: Prisma.$JobPayload<ExtArgs>[]
      savedSearches: Prisma.$SavedSearchPayload<ExtArgs>[]
      fetchRuns: Prisma.$FetchRunPayload<ExtArgs>[]
      deletedJobUrls: Prisma.$DeletedJobUrlPayload<ExtArgs>[]
      dailyCheckins: Prisma.$DailyCheckinPayload<ExtArgs>[]
      resumeProfiles: Prisma.$ResumeProfilePayload<ExtArgs>[]
      aiPromptProfile: Prisma.$AiPromptProfilePayload<ExtArgs> | null
      aiProviderConfig: Prisma.$UserAiProviderConfigPayload<ExtArgs> | null
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      name: string | null
      image: string | null
      emailVerified: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    jobs<T extends User$jobsArgs<ExtArgs> = {}>(args?: Subset<T, User$jobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    savedSearches<T extends User$savedSearchesArgs<ExtArgs> = {}>(args?: Subset<T, User$savedSearchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    fetchRuns<T extends User$fetchRunsArgs<ExtArgs> = {}>(args?: Subset<T, User$fetchRunsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deletedJobUrls<T extends User$deletedJobUrlsArgs<ExtArgs> = {}>(args?: Subset<T, User$deletedJobUrlsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    dailyCheckins<T extends User$dailyCheckinsArgs<ExtArgs> = {}>(args?: Subset<T, User$dailyCheckinsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    resumeProfiles<T extends User$resumeProfilesArgs<ExtArgs> = {}>(args?: Subset<T, User$resumeProfilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    aiPromptProfile<T extends User$aiPromptProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$aiPromptProfileArgs<ExtArgs>>): Prisma__AiPromptProfileClient<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    aiProviderConfig<T extends User$aiProviderConfigArgs<ExtArgs> = {}>(args?: Subset<T, User$aiProviderConfigArgs<ExtArgs>>): Prisma__UserAiProviderConfigClient<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    applications<T extends User$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, User$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly image: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.jobs
   */
  export type User$jobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    where?: JobWhereInput
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    cursor?: JobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * User.savedSearches
   */
  export type User$savedSearchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    where?: SavedSearchWhereInput
    orderBy?: SavedSearchOrderByWithRelationInput | SavedSearchOrderByWithRelationInput[]
    cursor?: SavedSearchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SavedSearchScalarFieldEnum | SavedSearchScalarFieldEnum[]
  }

  /**
   * User.fetchRuns
   */
  export type User$fetchRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    where?: FetchRunWhereInput
    orderBy?: FetchRunOrderByWithRelationInput | FetchRunOrderByWithRelationInput[]
    cursor?: FetchRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FetchRunScalarFieldEnum | FetchRunScalarFieldEnum[]
  }

  /**
   * User.deletedJobUrls
   */
  export type User$deletedJobUrlsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    where?: DeletedJobUrlWhereInput
    orderBy?: DeletedJobUrlOrderByWithRelationInput | DeletedJobUrlOrderByWithRelationInput[]
    cursor?: DeletedJobUrlWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeletedJobUrlScalarFieldEnum | DeletedJobUrlScalarFieldEnum[]
  }

  /**
   * User.dailyCheckins
   */
  export type User$dailyCheckinsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    where?: DailyCheckinWhereInput
    orderBy?: DailyCheckinOrderByWithRelationInput | DailyCheckinOrderByWithRelationInput[]
    cursor?: DailyCheckinWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DailyCheckinScalarFieldEnum | DailyCheckinScalarFieldEnum[]
  }

  /**
   * User.resumeProfiles
   */
  export type User$resumeProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    where?: ResumeProfileWhereInput
    orderBy?: ResumeProfileOrderByWithRelationInput | ResumeProfileOrderByWithRelationInput[]
    cursor?: ResumeProfileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResumeProfileScalarFieldEnum | ResumeProfileScalarFieldEnum[]
  }

  /**
   * User.aiPromptProfile
   */
  export type User$aiPromptProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    where?: AiPromptProfileWhereInput
  }

  /**
   * User.aiProviderConfig
   */
  export type User$aiProviderConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    where?: UserAiProviderConfigWhereInput
  }

  /**
   * User.applications
   */
  export type User$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires" | "createdAt" | "updatedAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Job
   */

  export type AggregateJob = {
    _count: JobCountAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  export type JobMinAggregateOutputType = {
    id: string | null
    userId: string | null
    jobUrl: string | null
    title: string | null
    company: string | null
    location: string | null
    jobType: string | null
    jobLevel: string | null
    description: string | null
    status: $Enums.JobStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JobMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    jobUrl: string | null
    title: string | null
    company: string | null
    location: string | null
    jobType: string | null
    jobLevel: string | null
    description: string | null
    status: $Enums.JobStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JobCountAggregateOutputType = {
    id: number
    userId: number
    jobUrl: number
    title: number
    company: number
    location: number
    jobType: number
    jobLevel: number
    description: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JobMinAggregateInputType = {
    id?: true
    userId?: true
    jobUrl?: true
    title?: true
    company?: true
    location?: true
    jobType?: true
    jobLevel?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JobMaxAggregateInputType = {
    id?: true
    userId?: true
    jobUrl?: true
    title?: true
    company?: true
    location?: true
    jobType?: true
    jobLevel?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JobCountAggregateInputType = {
    id?: true
    userId?: true
    jobUrl?: true
    title?: true
    company?: true
    location?: true
    jobType?: true
    jobLevel?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Job to aggregate.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jobs
    **/
    _count?: true | JobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobMaxAggregateInputType
  }

  export type GetJobAggregateType<T extends JobAggregateArgs> = {
        [P in keyof T & keyof AggregateJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob[P]>
      : GetScalarType<T[P], AggregateJob[P]>
  }




  export type JobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
    orderBy?: JobOrderByWithAggregationInput | JobOrderByWithAggregationInput[]
    by: JobScalarFieldEnum[] | JobScalarFieldEnum
    having?: JobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobCountAggregateInputType | true
    _min?: JobMinAggregateInputType
    _max?: JobMaxAggregateInputType
  }

  export type JobGroupByOutputType = {
    id: string
    userId: string
    jobUrl: string
    title: string
    company: string | null
    location: string | null
    jobType: string | null
    jobLevel: string | null
    description: string | null
    status: $Enums.JobStatus
    createdAt: Date
    updatedAt: Date
    _count: JobCountAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  type GetJobGroupByPayload<T extends JobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobGroupByOutputType[P]>
            : GetScalarType<T[P], JobGroupByOutputType[P]>
        }
      >
    >


  export type JobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobUrl?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    jobType?: boolean
    jobLevel?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    applications?: boolean | Job$applicationsArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobUrl?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    jobType?: boolean
    jobLevel?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobUrl?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    jobType?: boolean
    jobLevel?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectScalar = {
    id?: boolean
    userId?: boolean
    jobUrl?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    jobType?: boolean
    jobLevel?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "jobUrl" | "title" | "company" | "location" | "jobType" | "jobLevel" | "description" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["job"]>
  export type JobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    applications?: boolean | Job$applicationsArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type JobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $JobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Job"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      jobUrl: string
      title: string
      company: string | null
      location: string | null
      jobType: string | null
      jobLevel: string | null
      description: string | null
      status: $Enums.JobStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["job"]>
    composites: {}
  }

  type JobGetPayload<S extends boolean | null | undefined | JobDefaultArgs> = $Result.GetResult<Prisma.$JobPayload, S>

  type JobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JobCountAggregateInputType | true
    }

  export interface JobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Job'], meta: { name: 'Job' } }
    /**
     * Find zero or one Job that matches the filter.
     * @param {JobFindUniqueArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobFindUniqueArgs>(args: SelectSubset<T, JobFindUniqueArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Job that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JobFindUniqueOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobFindUniqueOrThrowArgs>(args: SelectSubset<T, JobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobFindFirstArgs>(args?: SelectSubset<T, JobFindFirstArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobFindFirstOrThrowArgs>(args?: SelectSubset<T, JobFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jobs
     * const jobs = await prisma.job.findMany()
     * 
     * // Get first 10 Jobs
     * const jobs = await prisma.job.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jobWithIdOnly = await prisma.job.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JobFindManyArgs>(args?: SelectSubset<T, JobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Job.
     * @param {JobCreateArgs} args - Arguments to create a Job.
     * @example
     * // Create one Job
     * const Job = await prisma.job.create({
     *   data: {
     *     // ... data to create a Job
     *   }
     * })
     * 
     */
    create<T extends JobCreateArgs>(args: SelectSubset<T, JobCreateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jobs.
     * @param {JobCreateManyArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobCreateManyArgs>(args?: SelectSubset<T, JobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jobs and returns the data saved in the database.
     * @param {JobCreateManyAndReturnArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jobs and only return the `id`
     * const jobWithIdOnly = await prisma.job.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobCreateManyAndReturnArgs>(args?: SelectSubset<T, JobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Job.
     * @param {JobDeleteArgs} args - Arguments to delete one Job.
     * @example
     * // Delete one Job
     * const Job = await prisma.job.delete({
     *   where: {
     *     // ... filter to delete one Job
     *   }
     * })
     * 
     */
    delete<T extends JobDeleteArgs>(args: SelectSubset<T, JobDeleteArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Job.
     * @param {JobUpdateArgs} args - Arguments to update one Job.
     * @example
     * // Update one Job
     * const job = await prisma.job.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobUpdateArgs>(args: SelectSubset<T, JobUpdateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jobs.
     * @param {JobDeleteManyArgs} args - Arguments to filter Jobs to delete.
     * @example
     * // Delete a few Jobs
     * const { count } = await prisma.job.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobDeleteManyArgs>(args?: SelectSubset<T, JobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobUpdateManyArgs>(args: SelectSubset<T, JobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs and returns the data updated in the database.
     * @param {JobUpdateManyAndReturnArgs} args - Arguments to update many Jobs.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Jobs and only return the `id`
     * const jobWithIdOnly = await prisma.job.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JobUpdateManyAndReturnArgs>(args: SelectSubset<T, JobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Job.
     * @param {JobUpsertArgs} args - Arguments to update or create a Job.
     * @example
     * // Update or create a Job
     * const job = await prisma.job.upsert({
     *   create: {
     *     // ... data to create a Job
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job we want to update
     *   }
     * })
     */
    upsert<T extends JobUpsertArgs>(args: SelectSubset<T, JobUpsertArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobCountArgs} args - Arguments to filter Jobs to count.
     * @example
     * // Count the number of Jobs
     * const count = await prisma.job.count({
     *   where: {
     *     // ... the filter for the Jobs we want to count
     *   }
     * })
    **/
    count<T extends JobCountArgs>(
      args?: Subset<T, JobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobAggregateArgs>(args: Subset<T, JobAggregateArgs>): Prisma.PrismaPromise<GetJobAggregateType<T>>

    /**
     * Group by Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobGroupByArgs['orderBy'] }
        : { orderBy?: JobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Job model
   */
  readonly fields: JobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Job.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    applications<T extends Job$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Job$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Job model
   */
  interface JobFieldRefs {
    readonly id: FieldRef<"Job", 'String'>
    readonly userId: FieldRef<"Job", 'String'>
    readonly jobUrl: FieldRef<"Job", 'String'>
    readonly title: FieldRef<"Job", 'String'>
    readonly company: FieldRef<"Job", 'String'>
    readonly location: FieldRef<"Job", 'String'>
    readonly jobType: FieldRef<"Job", 'String'>
    readonly jobLevel: FieldRef<"Job", 'String'>
    readonly description: FieldRef<"Job", 'String'>
    readonly status: FieldRef<"Job", 'JobStatus'>
    readonly createdAt: FieldRef<"Job", 'DateTime'>
    readonly updatedAt: FieldRef<"Job", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Job findUnique
   */
  export type JobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findUniqueOrThrow
   */
  export type JobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findFirst
   */
  export type JobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findFirstOrThrow
   */
  export type JobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findMany
   */
  export type JobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Jobs to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job create
   */
  export type JobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to create a Job.
     */
    data: XOR<JobCreateInput, JobUncheckedCreateInput>
  }

  /**
   * Job createMany
   */
  export type JobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Job createManyAndReturn
   */
  export type JobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Job update
   */
  export type JobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to update a Job.
     */
    data: XOR<JobUpdateInput, JobUncheckedUpdateInput>
    /**
     * Choose, which Job to update.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job updateMany
   */
  export type JobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to update.
     */
    limit?: number
  }

  /**
   * Job updateManyAndReturn
   */
  export type JobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Job upsert
   */
  export type JobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The filter to search for the Job to update in case it exists.
     */
    where: JobWhereUniqueInput
    /**
     * In case the Job found by the `where` argument doesn't exist, create a new Job with this data.
     */
    create: XOR<JobCreateInput, JobUncheckedCreateInput>
    /**
     * In case the Job was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobUpdateInput, JobUncheckedUpdateInput>
  }

  /**
   * Job delete
   */
  export type JobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter which Job to delete.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job deleteMany
   */
  export type JobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jobs to delete
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to delete.
     */
    limit?: number
  }

  /**
   * Job.applications
   */
  export type Job$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Job without action
   */
  export type JobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
  }


  /**
   * Model DeletedJobUrl
   */

  export type AggregateDeletedJobUrl = {
    _count: DeletedJobUrlCountAggregateOutputType | null
    _min: DeletedJobUrlMinAggregateOutputType | null
    _max: DeletedJobUrlMaxAggregateOutputType | null
  }

  export type DeletedJobUrlMinAggregateOutputType = {
    id: string | null
    userId: string | null
    jobUrl: string | null
    deletedAt: Date | null
  }

  export type DeletedJobUrlMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    jobUrl: string | null
    deletedAt: Date | null
  }

  export type DeletedJobUrlCountAggregateOutputType = {
    id: number
    userId: number
    jobUrl: number
    deletedAt: number
    _all: number
  }


  export type DeletedJobUrlMinAggregateInputType = {
    id?: true
    userId?: true
    jobUrl?: true
    deletedAt?: true
  }

  export type DeletedJobUrlMaxAggregateInputType = {
    id?: true
    userId?: true
    jobUrl?: true
    deletedAt?: true
  }

  export type DeletedJobUrlCountAggregateInputType = {
    id?: true
    userId?: true
    jobUrl?: true
    deletedAt?: true
    _all?: true
  }

  export type DeletedJobUrlAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeletedJobUrl to aggregate.
     */
    where?: DeletedJobUrlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedJobUrls to fetch.
     */
    orderBy?: DeletedJobUrlOrderByWithRelationInput | DeletedJobUrlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeletedJobUrlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedJobUrls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedJobUrls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeletedJobUrls
    **/
    _count?: true | DeletedJobUrlCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeletedJobUrlMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeletedJobUrlMaxAggregateInputType
  }

  export type GetDeletedJobUrlAggregateType<T extends DeletedJobUrlAggregateArgs> = {
        [P in keyof T & keyof AggregateDeletedJobUrl]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeletedJobUrl[P]>
      : GetScalarType<T[P], AggregateDeletedJobUrl[P]>
  }




  export type DeletedJobUrlGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeletedJobUrlWhereInput
    orderBy?: DeletedJobUrlOrderByWithAggregationInput | DeletedJobUrlOrderByWithAggregationInput[]
    by: DeletedJobUrlScalarFieldEnum[] | DeletedJobUrlScalarFieldEnum
    having?: DeletedJobUrlScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeletedJobUrlCountAggregateInputType | true
    _min?: DeletedJobUrlMinAggregateInputType
    _max?: DeletedJobUrlMaxAggregateInputType
  }

  export type DeletedJobUrlGroupByOutputType = {
    id: string
    userId: string
    jobUrl: string
    deletedAt: Date
    _count: DeletedJobUrlCountAggregateOutputType | null
    _min: DeletedJobUrlMinAggregateOutputType | null
    _max: DeletedJobUrlMaxAggregateOutputType | null
  }

  type GetDeletedJobUrlGroupByPayload<T extends DeletedJobUrlGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeletedJobUrlGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeletedJobUrlGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeletedJobUrlGroupByOutputType[P]>
            : GetScalarType<T[P], DeletedJobUrlGroupByOutputType[P]>
        }
      >
    >


  export type DeletedJobUrlSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobUrl?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deletedJobUrl"]>

  export type DeletedJobUrlSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobUrl?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deletedJobUrl"]>

  export type DeletedJobUrlSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobUrl?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deletedJobUrl"]>

  export type DeletedJobUrlSelectScalar = {
    id?: boolean
    userId?: boolean
    jobUrl?: boolean
    deletedAt?: boolean
  }

  export type DeletedJobUrlOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "jobUrl" | "deletedAt", ExtArgs["result"]["deletedJobUrl"]>
  export type DeletedJobUrlInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DeletedJobUrlIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DeletedJobUrlIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DeletedJobUrlPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeletedJobUrl"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      jobUrl: string
      deletedAt: Date
    }, ExtArgs["result"]["deletedJobUrl"]>
    composites: {}
  }

  type DeletedJobUrlGetPayload<S extends boolean | null | undefined | DeletedJobUrlDefaultArgs> = $Result.GetResult<Prisma.$DeletedJobUrlPayload, S>

  type DeletedJobUrlCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeletedJobUrlFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeletedJobUrlCountAggregateInputType | true
    }

  export interface DeletedJobUrlDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeletedJobUrl'], meta: { name: 'DeletedJobUrl' } }
    /**
     * Find zero or one DeletedJobUrl that matches the filter.
     * @param {DeletedJobUrlFindUniqueArgs} args - Arguments to find a DeletedJobUrl
     * @example
     * // Get one DeletedJobUrl
     * const deletedJobUrl = await prisma.deletedJobUrl.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeletedJobUrlFindUniqueArgs>(args: SelectSubset<T, DeletedJobUrlFindUniqueArgs<ExtArgs>>): Prisma__DeletedJobUrlClient<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DeletedJobUrl that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeletedJobUrlFindUniqueOrThrowArgs} args - Arguments to find a DeletedJobUrl
     * @example
     * // Get one DeletedJobUrl
     * const deletedJobUrl = await prisma.deletedJobUrl.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeletedJobUrlFindUniqueOrThrowArgs>(args: SelectSubset<T, DeletedJobUrlFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeletedJobUrlClient<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeletedJobUrl that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedJobUrlFindFirstArgs} args - Arguments to find a DeletedJobUrl
     * @example
     * // Get one DeletedJobUrl
     * const deletedJobUrl = await prisma.deletedJobUrl.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeletedJobUrlFindFirstArgs>(args?: SelectSubset<T, DeletedJobUrlFindFirstArgs<ExtArgs>>): Prisma__DeletedJobUrlClient<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeletedJobUrl that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedJobUrlFindFirstOrThrowArgs} args - Arguments to find a DeletedJobUrl
     * @example
     * // Get one DeletedJobUrl
     * const deletedJobUrl = await prisma.deletedJobUrl.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeletedJobUrlFindFirstOrThrowArgs>(args?: SelectSubset<T, DeletedJobUrlFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeletedJobUrlClient<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DeletedJobUrls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedJobUrlFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeletedJobUrls
     * const deletedJobUrls = await prisma.deletedJobUrl.findMany()
     * 
     * // Get first 10 DeletedJobUrls
     * const deletedJobUrls = await prisma.deletedJobUrl.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deletedJobUrlWithIdOnly = await prisma.deletedJobUrl.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeletedJobUrlFindManyArgs>(args?: SelectSubset<T, DeletedJobUrlFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DeletedJobUrl.
     * @param {DeletedJobUrlCreateArgs} args - Arguments to create a DeletedJobUrl.
     * @example
     * // Create one DeletedJobUrl
     * const DeletedJobUrl = await prisma.deletedJobUrl.create({
     *   data: {
     *     // ... data to create a DeletedJobUrl
     *   }
     * })
     * 
     */
    create<T extends DeletedJobUrlCreateArgs>(args: SelectSubset<T, DeletedJobUrlCreateArgs<ExtArgs>>): Prisma__DeletedJobUrlClient<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DeletedJobUrls.
     * @param {DeletedJobUrlCreateManyArgs} args - Arguments to create many DeletedJobUrls.
     * @example
     * // Create many DeletedJobUrls
     * const deletedJobUrl = await prisma.deletedJobUrl.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeletedJobUrlCreateManyArgs>(args?: SelectSubset<T, DeletedJobUrlCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DeletedJobUrls and returns the data saved in the database.
     * @param {DeletedJobUrlCreateManyAndReturnArgs} args - Arguments to create many DeletedJobUrls.
     * @example
     * // Create many DeletedJobUrls
     * const deletedJobUrl = await prisma.deletedJobUrl.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DeletedJobUrls and only return the `id`
     * const deletedJobUrlWithIdOnly = await prisma.deletedJobUrl.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeletedJobUrlCreateManyAndReturnArgs>(args?: SelectSubset<T, DeletedJobUrlCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DeletedJobUrl.
     * @param {DeletedJobUrlDeleteArgs} args - Arguments to delete one DeletedJobUrl.
     * @example
     * // Delete one DeletedJobUrl
     * const DeletedJobUrl = await prisma.deletedJobUrl.delete({
     *   where: {
     *     // ... filter to delete one DeletedJobUrl
     *   }
     * })
     * 
     */
    delete<T extends DeletedJobUrlDeleteArgs>(args: SelectSubset<T, DeletedJobUrlDeleteArgs<ExtArgs>>): Prisma__DeletedJobUrlClient<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DeletedJobUrl.
     * @param {DeletedJobUrlUpdateArgs} args - Arguments to update one DeletedJobUrl.
     * @example
     * // Update one DeletedJobUrl
     * const deletedJobUrl = await prisma.deletedJobUrl.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeletedJobUrlUpdateArgs>(args: SelectSubset<T, DeletedJobUrlUpdateArgs<ExtArgs>>): Prisma__DeletedJobUrlClient<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DeletedJobUrls.
     * @param {DeletedJobUrlDeleteManyArgs} args - Arguments to filter DeletedJobUrls to delete.
     * @example
     * // Delete a few DeletedJobUrls
     * const { count } = await prisma.deletedJobUrl.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeletedJobUrlDeleteManyArgs>(args?: SelectSubset<T, DeletedJobUrlDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeletedJobUrls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedJobUrlUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeletedJobUrls
     * const deletedJobUrl = await prisma.deletedJobUrl.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeletedJobUrlUpdateManyArgs>(args: SelectSubset<T, DeletedJobUrlUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeletedJobUrls and returns the data updated in the database.
     * @param {DeletedJobUrlUpdateManyAndReturnArgs} args - Arguments to update many DeletedJobUrls.
     * @example
     * // Update many DeletedJobUrls
     * const deletedJobUrl = await prisma.deletedJobUrl.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DeletedJobUrls and only return the `id`
     * const deletedJobUrlWithIdOnly = await prisma.deletedJobUrl.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeletedJobUrlUpdateManyAndReturnArgs>(args: SelectSubset<T, DeletedJobUrlUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DeletedJobUrl.
     * @param {DeletedJobUrlUpsertArgs} args - Arguments to update or create a DeletedJobUrl.
     * @example
     * // Update or create a DeletedJobUrl
     * const deletedJobUrl = await prisma.deletedJobUrl.upsert({
     *   create: {
     *     // ... data to create a DeletedJobUrl
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeletedJobUrl we want to update
     *   }
     * })
     */
    upsert<T extends DeletedJobUrlUpsertArgs>(args: SelectSubset<T, DeletedJobUrlUpsertArgs<ExtArgs>>): Prisma__DeletedJobUrlClient<$Result.GetResult<Prisma.$DeletedJobUrlPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DeletedJobUrls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedJobUrlCountArgs} args - Arguments to filter DeletedJobUrls to count.
     * @example
     * // Count the number of DeletedJobUrls
     * const count = await prisma.deletedJobUrl.count({
     *   where: {
     *     // ... the filter for the DeletedJobUrls we want to count
     *   }
     * })
    **/
    count<T extends DeletedJobUrlCountArgs>(
      args?: Subset<T, DeletedJobUrlCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeletedJobUrlCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeletedJobUrl.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedJobUrlAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeletedJobUrlAggregateArgs>(args: Subset<T, DeletedJobUrlAggregateArgs>): Prisma.PrismaPromise<GetDeletedJobUrlAggregateType<T>>

    /**
     * Group by DeletedJobUrl.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedJobUrlGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeletedJobUrlGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeletedJobUrlGroupByArgs['orderBy'] }
        : { orderBy?: DeletedJobUrlGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeletedJobUrlGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeletedJobUrlGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeletedJobUrl model
   */
  readonly fields: DeletedJobUrlFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeletedJobUrl.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeletedJobUrlClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DeletedJobUrl model
   */
  interface DeletedJobUrlFieldRefs {
    readonly id: FieldRef<"DeletedJobUrl", 'String'>
    readonly userId: FieldRef<"DeletedJobUrl", 'String'>
    readonly jobUrl: FieldRef<"DeletedJobUrl", 'String'>
    readonly deletedAt: FieldRef<"DeletedJobUrl", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DeletedJobUrl findUnique
   */
  export type DeletedJobUrlFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    /**
     * Filter, which DeletedJobUrl to fetch.
     */
    where: DeletedJobUrlWhereUniqueInput
  }

  /**
   * DeletedJobUrl findUniqueOrThrow
   */
  export type DeletedJobUrlFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    /**
     * Filter, which DeletedJobUrl to fetch.
     */
    where: DeletedJobUrlWhereUniqueInput
  }

  /**
   * DeletedJobUrl findFirst
   */
  export type DeletedJobUrlFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    /**
     * Filter, which DeletedJobUrl to fetch.
     */
    where?: DeletedJobUrlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedJobUrls to fetch.
     */
    orderBy?: DeletedJobUrlOrderByWithRelationInput | DeletedJobUrlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeletedJobUrls.
     */
    cursor?: DeletedJobUrlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedJobUrls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedJobUrls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeletedJobUrls.
     */
    distinct?: DeletedJobUrlScalarFieldEnum | DeletedJobUrlScalarFieldEnum[]
  }

  /**
   * DeletedJobUrl findFirstOrThrow
   */
  export type DeletedJobUrlFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    /**
     * Filter, which DeletedJobUrl to fetch.
     */
    where?: DeletedJobUrlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedJobUrls to fetch.
     */
    orderBy?: DeletedJobUrlOrderByWithRelationInput | DeletedJobUrlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeletedJobUrls.
     */
    cursor?: DeletedJobUrlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedJobUrls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedJobUrls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeletedJobUrls.
     */
    distinct?: DeletedJobUrlScalarFieldEnum | DeletedJobUrlScalarFieldEnum[]
  }

  /**
   * DeletedJobUrl findMany
   */
  export type DeletedJobUrlFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    /**
     * Filter, which DeletedJobUrls to fetch.
     */
    where?: DeletedJobUrlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedJobUrls to fetch.
     */
    orderBy?: DeletedJobUrlOrderByWithRelationInput | DeletedJobUrlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeletedJobUrls.
     */
    cursor?: DeletedJobUrlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedJobUrls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedJobUrls.
     */
    skip?: number
    distinct?: DeletedJobUrlScalarFieldEnum | DeletedJobUrlScalarFieldEnum[]
  }

  /**
   * DeletedJobUrl create
   */
  export type DeletedJobUrlCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    /**
     * The data needed to create a DeletedJobUrl.
     */
    data: XOR<DeletedJobUrlCreateInput, DeletedJobUrlUncheckedCreateInput>
  }

  /**
   * DeletedJobUrl createMany
   */
  export type DeletedJobUrlCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeletedJobUrls.
     */
    data: DeletedJobUrlCreateManyInput | DeletedJobUrlCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DeletedJobUrl createManyAndReturn
   */
  export type DeletedJobUrlCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * The data used to create many DeletedJobUrls.
     */
    data: DeletedJobUrlCreateManyInput | DeletedJobUrlCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeletedJobUrl update
   */
  export type DeletedJobUrlUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    /**
     * The data needed to update a DeletedJobUrl.
     */
    data: XOR<DeletedJobUrlUpdateInput, DeletedJobUrlUncheckedUpdateInput>
    /**
     * Choose, which DeletedJobUrl to update.
     */
    where: DeletedJobUrlWhereUniqueInput
  }

  /**
   * DeletedJobUrl updateMany
   */
  export type DeletedJobUrlUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeletedJobUrls.
     */
    data: XOR<DeletedJobUrlUpdateManyMutationInput, DeletedJobUrlUncheckedUpdateManyInput>
    /**
     * Filter which DeletedJobUrls to update
     */
    where?: DeletedJobUrlWhereInput
    /**
     * Limit how many DeletedJobUrls to update.
     */
    limit?: number
  }

  /**
   * DeletedJobUrl updateManyAndReturn
   */
  export type DeletedJobUrlUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * The data used to update DeletedJobUrls.
     */
    data: XOR<DeletedJobUrlUpdateManyMutationInput, DeletedJobUrlUncheckedUpdateManyInput>
    /**
     * Filter which DeletedJobUrls to update
     */
    where?: DeletedJobUrlWhereInput
    /**
     * Limit how many DeletedJobUrls to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeletedJobUrl upsert
   */
  export type DeletedJobUrlUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    /**
     * The filter to search for the DeletedJobUrl to update in case it exists.
     */
    where: DeletedJobUrlWhereUniqueInput
    /**
     * In case the DeletedJobUrl found by the `where` argument doesn't exist, create a new DeletedJobUrl with this data.
     */
    create: XOR<DeletedJobUrlCreateInput, DeletedJobUrlUncheckedCreateInput>
    /**
     * In case the DeletedJobUrl was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeletedJobUrlUpdateInput, DeletedJobUrlUncheckedUpdateInput>
  }

  /**
   * DeletedJobUrl delete
   */
  export type DeletedJobUrlDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
    /**
     * Filter which DeletedJobUrl to delete.
     */
    where: DeletedJobUrlWhereUniqueInput
  }

  /**
   * DeletedJobUrl deleteMany
   */
  export type DeletedJobUrlDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeletedJobUrls to delete
     */
    where?: DeletedJobUrlWhereInput
    /**
     * Limit how many DeletedJobUrls to delete.
     */
    limit?: number
  }

  /**
   * DeletedJobUrl without action
   */
  export type DeletedJobUrlDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedJobUrl
     */
    select?: DeletedJobUrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeletedJobUrl
     */
    omit?: DeletedJobUrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeletedJobUrlInclude<ExtArgs> | null
  }


  /**
   * Model DailyCheckin
   */

  export type AggregateDailyCheckin = {
    _count: DailyCheckinCountAggregateOutputType | null
    _min: DailyCheckinMinAggregateOutputType | null
    _max: DailyCheckinMaxAggregateOutputType | null
  }

  export type DailyCheckinMinAggregateOutputType = {
    id: string | null
    userId: string | null
    localDate: string | null
    checkedAt: Date | null
  }

  export type DailyCheckinMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    localDate: string | null
    checkedAt: Date | null
  }

  export type DailyCheckinCountAggregateOutputType = {
    id: number
    userId: number
    localDate: number
    checkedAt: number
    _all: number
  }


  export type DailyCheckinMinAggregateInputType = {
    id?: true
    userId?: true
    localDate?: true
    checkedAt?: true
  }

  export type DailyCheckinMaxAggregateInputType = {
    id?: true
    userId?: true
    localDate?: true
    checkedAt?: true
  }

  export type DailyCheckinCountAggregateInputType = {
    id?: true
    userId?: true
    localDate?: true
    checkedAt?: true
    _all?: true
  }

  export type DailyCheckinAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyCheckin to aggregate.
     */
    where?: DailyCheckinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyCheckins to fetch.
     */
    orderBy?: DailyCheckinOrderByWithRelationInput | DailyCheckinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailyCheckinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyCheckins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyCheckins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailyCheckins
    **/
    _count?: true | DailyCheckinCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailyCheckinMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailyCheckinMaxAggregateInputType
  }

  export type GetDailyCheckinAggregateType<T extends DailyCheckinAggregateArgs> = {
        [P in keyof T & keyof AggregateDailyCheckin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailyCheckin[P]>
      : GetScalarType<T[P], AggregateDailyCheckin[P]>
  }




  export type DailyCheckinGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyCheckinWhereInput
    orderBy?: DailyCheckinOrderByWithAggregationInput | DailyCheckinOrderByWithAggregationInput[]
    by: DailyCheckinScalarFieldEnum[] | DailyCheckinScalarFieldEnum
    having?: DailyCheckinScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailyCheckinCountAggregateInputType | true
    _min?: DailyCheckinMinAggregateInputType
    _max?: DailyCheckinMaxAggregateInputType
  }

  export type DailyCheckinGroupByOutputType = {
    id: string
    userId: string
    localDate: string
    checkedAt: Date
    _count: DailyCheckinCountAggregateOutputType | null
    _min: DailyCheckinMinAggregateOutputType | null
    _max: DailyCheckinMaxAggregateOutputType | null
  }

  type GetDailyCheckinGroupByPayload<T extends DailyCheckinGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailyCheckinGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailyCheckinGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailyCheckinGroupByOutputType[P]>
            : GetScalarType<T[P], DailyCheckinGroupByOutputType[P]>
        }
      >
    >


  export type DailyCheckinSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    localDate?: boolean
    checkedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyCheckin"]>

  export type DailyCheckinSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    localDate?: boolean
    checkedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyCheckin"]>

  export type DailyCheckinSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    localDate?: boolean
    checkedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyCheckin"]>

  export type DailyCheckinSelectScalar = {
    id?: boolean
    userId?: boolean
    localDate?: boolean
    checkedAt?: boolean
  }

  export type DailyCheckinOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "localDate" | "checkedAt", ExtArgs["result"]["dailyCheckin"]>
  export type DailyCheckinInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DailyCheckinIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DailyCheckinIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DailyCheckinPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailyCheckin"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      localDate: string
      checkedAt: Date
    }, ExtArgs["result"]["dailyCheckin"]>
    composites: {}
  }

  type DailyCheckinGetPayload<S extends boolean | null | undefined | DailyCheckinDefaultArgs> = $Result.GetResult<Prisma.$DailyCheckinPayload, S>

  type DailyCheckinCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DailyCheckinFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DailyCheckinCountAggregateInputType | true
    }

  export interface DailyCheckinDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailyCheckin'], meta: { name: 'DailyCheckin' } }
    /**
     * Find zero or one DailyCheckin that matches the filter.
     * @param {DailyCheckinFindUniqueArgs} args - Arguments to find a DailyCheckin
     * @example
     * // Get one DailyCheckin
     * const dailyCheckin = await prisma.dailyCheckin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailyCheckinFindUniqueArgs>(args: SelectSubset<T, DailyCheckinFindUniqueArgs<ExtArgs>>): Prisma__DailyCheckinClient<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DailyCheckin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DailyCheckinFindUniqueOrThrowArgs} args - Arguments to find a DailyCheckin
     * @example
     * // Get one DailyCheckin
     * const dailyCheckin = await prisma.dailyCheckin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailyCheckinFindUniqueOrThrowArgs>(args: SelectSubset<T, DailyCheckinFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailyCheckinClient<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyCheckin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckinFindFirstArgs} args - Arguments to find a DailyCheckin
     * @example
     * // Get one DailyCheckin
     * const dailyCheckin = await prisma.dailyCheckin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailyCheckinFindFirstArgs>(args?: SelectSubset<T, DailyCheckinFindFirstArgs<ExtArgs>>): Prisma__DailyCheckinClient<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyCheckin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckinFindFirstOrThrowArgs} args - Arguments to find a DailyCheckin
     * @example
     * // Get one DailyCheckin
     * const dailyCheckin = await prisma.dailyCheckin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailyCheckinFindFirstOrThrowArgs>(args?: SelectSubset<T, DailyCheckinFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailyCheckinClient<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DailyCheckins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckinFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailyCheckins
     * const dailyCheckins = await prisma.dailyCheckin.findMany()
     * 
     * // Get first 10 DailyCheckins
     * const dailyCheckins = await prisma.dailyCheckin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailyCheckinWithIdOnly = await prisma.dailyCheckin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailyCheckinFindManyArgs>(args?: SelectSubset<T, DailyCheckinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DailyCheckin.
     * @param {DailyCheckinCreateArgs} args - Arguments to create a DailyCheckin.
     * @example
     * // Create one DailyCheckin
     * const DailyCheckin = await prisma.dailyCheckin.create({
     *   data: {
     *     // ... data to create a DailyCheckin
     *   }
     * })
     * 
     */
    create<T extends DailyCheckinCreateArgs>(args: SelectSubset<T, DailyCheckinCreateArgs<ExtArgs>>): Prisma__DailyCheckinClient<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DailyCheckins.
     * @param {DailyCheckinCreateManyArgs} args - Arguments to create many DailyCheckins.
     * @example
     * // Create many DailyCheckins
     * const dailyCheckin = await prisma.dailyCheckin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailyCheckinCreateManyArgs>(args?: SelectSubset<T, DailyCheckinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailyCheckins and returns the data saved in the database.
     * @param {DailyCheckinCreateManyAndReturnArgs} args - Arguments to create many DailyCheckins.
     * @example
     * // Create many DailyCheckins
     * const dailyCheckin = await prisma.dailyCheckin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailyCheckins and only return the `id`
     * const dailyCheckinWithIdOnly = await prisma.dailyCheckin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailyCheckinCreateManyAndReturnArgs>(args?: SelectSubset<T, DailyCheckinCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DailyCheckin.
     * @param {DailyCheckinDeleteArgs} args - Arguments to delete one DailyCheckin.
     * @example
     * // Delete one DailyCheckin
     * const DailyCheckin = await prisma.dailyCheckin.delete({
     *   where: {
     *     // ... filter to delete one DailyCheckin
     *   }
     * })
     * 
     */
    delete<T extends DailyCheckinDeleteArgs>(args: SelectSubset<T, DailyCheckinDeleteArgs<ExtArgs>>): Prisma__DailyCheckinClient<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DailyCheckin.
     * @param {DailyCheckinUpdateArgs} args - Arguments to update one DailyCheckin.
     * @example
     * // Update one DailyCheckin
     * const dailyCheckin = await prisma.dailyCheckin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailyCheckinUpdateArgs>(args: SelectSubset<T, DailyCheckinUpdateArgs<ExtArgs>>): Prisma__DailyCheckinClient<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DailyCheckins.
     * @param {DailyCheckinDeleteManyArgs} args - Arguments to filter DailyCheckins to delete.
     * @example
     * // Delete a few DailyCheckins
     * const { count } = await prisma.dailyCheckin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailyCheckinDeleteManyArgs>(args?: SelectSubset<T, DailyCheckinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyCheckins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailyCheckins
     * const dailyCheckin = await prisma.dailyCheckin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailyCheckinUpdateManyArgs>(args: SelectSubset<T, DailyCheckinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyCheckins and returns the data updated in the database.
     * @param {DailyCheckinUpdateManyAndReturnArgs} args - Arguments to update many DailyCheckins.
     * @example
     * // Update many DailyCheckins
     * const dailyCheckin = await prisma.dailyCheckin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DailyCheckins and only return the `id`
     * const dailyCheckinWithIdOnly = await prisma.dailyCheckin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DailyCheckinUpdateManyAndReturnArgs>(args: SelectSubset<T, DailyCheckinUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DailyCheckin.
     * @param {DailyCheckinUpsertArgs} args - Arguments to update or create a DailyCheckin.
     * @example
     * // Update or create a DailyCheckin
     * const dailyCheckin = await prisma.dailyCheckin.upsert({
     *   create: {
     *     // ... data to create a DailyCheckin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailyCheckin we want to update
     *   }
     * })
     */
    upsert<T extends DailyCheckinUpsertArgs>(args: SelectSubset<T, DailyCheckinUpsertArgs<ExtArgs>>): Prisma__DailyCheckinClient<$Result.GetResult<Prisma.$DailyCheckinPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DailyCheckins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckinCountArgs} args - Arguments to filter DailyCheckins to count.
     * @example
     * // Count the number of DailyCheckins
     * const count = await prisma.dailyCheckin.count({
     *   where: {
     *     // ... the filter for the DailyCheckins we want to count
     *   }
     * })
    **/
    count<T extends DailyCheckinCountArgs>(
      args?: Subset<T, DailyCheckinCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailyCheckinCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailyCheckin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DailyCheckinAggregateArgs>(args: Subset<T, DailyCheckinAggregateArgs>): Prisma.PrismaPromise<GetDailyCheckinAggregateType<T>>

    /**
     * Group by DailyCheckin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyCheckinGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DailyCheckinGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailyCheckinGroupByArgs['orderBy'] }
        : { orderBy?: DailyCheckinGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DailyCheckinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailyCheckinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailyCheckin model
   */
  readonly fields: DailyCheckinFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailyCheckin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailyCheckinClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DailyCheckin model
   */
  interface DailyCheckinFieldRefs {
    readonly id: FieldRef<"DailyCheckin", 'String'>
    readonly userId: FieldRef<"DailyCheckin", 'String'>
    readonly localDate: FieldRef<"DailyCheckin", 'String'>
    readonly checkedAt: FieldRef<"DailyCheckin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailyCheckin findUnique
   */
  export type DailyCheckinFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckin to fetch.
     */
    where: DailyCheckinWhereUniqueInput
  }

  /**
   * DailyCheckin findUniqueOrThrow
   */
  export type DailyCheckinFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckin to fetch.
     */
    where: DailyCheckinWhereUniqueInput
  }

  /**
   * DailyCheckin findFirst
   */
  export type DailyCheckinFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckin to fetch.
     */
    where?: DailyCheckinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyCheckins to fetch.
     */
    orderBy?: DailyCheckinOrderByWithRelationInput | DailyCheckinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyCheckins.
     */
    cursor?: DailyCheckinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyCheckins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyCheckins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyCheckins.
     */
    distinct?: DailyCheckinScalarFieldEnum | DailyCheckinScalarFieldEnum[]
  }

  /**
   * DailyCheckin findFirstOrThrow
   */
  export type DailyCheckinFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckin to fetch.
     */
    where?: DailyCheckinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyCheckins to fetch.
     */
    orderBy?: DailyCheckinOrderByWithRelationInput | DailyCheckinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyCheckins.
     */
    cursor?: DailyCheckinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyCheckins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyCheckins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyCheckins.
     */
    distinct?: DailyCheckinScalarFieldEnum | DailyCheckinScalarFieldEnum[]
  }

  /**
   * DailyCheckin findMany
   */
  export type DailyCheckinFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    /**
     * Filter, which DailyCheckins to fetch.
     */
    where?: DailyCheckinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyCheckins to fetch.
     */
    orderBy?: DailyCheckinOrderByWithRelationInput | DailyCheckinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailyCheckins.
     */
    cursor?: DailyCheckinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyCheckins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyCheckins.
     */
    skip?: number
    distinct?: DailyCheckinScalarFieldEnum | DailyCheckinScalarFieldEnum[]
  }

  /**
   * DailyCheckin create
   */
  export type DailyCheckinCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    /**
     * The data needed to create a DailyCheckin.
     */
    data: XOR<DailyCheckinCreateInput, DailyCheckinUncheckedCreateInput>
  }

  /**
   * DailyCheckin createMany
   */
  export type DailyCheckinCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailyCheckins.
     */
    data: DailyCheckinCreateManyInput | DailyCheckinCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyCheckin createManyAndReturn
   */
  export type DailyCheckinCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * The data used to create many DailyCheckins.
     */
    data: DailyCheckinCreateManyInput | DailyCheckinCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyCheckin update
   */
  export type DailyCheckinUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    /**
     * The data needed to update a DailyCheckin.
     */
    data: XOR<DailyCheckinUpdateInput, DailyCheckinUncheckedUpdateInput>
    /**
     * Choose, which DailyCheckin to update.
     */
    where: DailyCheckinWhereUniqueInput
  }

  /**
   * DailyCheckin updateMany
   */
  export type DailyCheckinUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailyCheckins.
     */
    data: XOR<DailyCheckinUpdateManyMutationInput, DailyCheckinUncheckedUpdateManyInput>
    /**
     * Filter which DailyCheckins to update
     */
    where?: DailyCheckinWhereInput
    /**
     * Limit how many DailyCheckins to update.
     */
    limit?: number
  }

  /**
   * DailyCheckin updateManyAndReturn
   */
  export type DailyCheckinUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * The data used to update DailyCheckins.
     */
    data: XOR<DailyCheckinUpdateManyMutationInput, DailyCheckinUncheckedUpdateManyInput>
    /**
     * Filter which DailyCheckins to update
     */
    where?: DailyCheckinWhereInput
    /**
     * Limit how many DailyCheckins to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyCheckin upsert
   */
  export type DailyCheckinUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    /**
     * The filter to search for the DailyCheckin to update in case it exists.
     */
    where: DailyCheckinWhereUniqueInput
    /**
     * In case the DailyCheckin found by the `where` argument doesn't exist, create a new DailyCheckin with this data.
     */
    create: XOR<DailyCheckinCreateInput, DailyCheckinUncheckedCreateInput>
    /**
     * In case the DailyCheckin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailyCheckinUpdateInput, DailyCheckinUncheckedUpdateInput>
  }

  /**
   * DailyCheckin delete
   */
  export type DailyCheckinDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
    /**
     * Filter which DailyCheckin to delete.
     */
    where: DailyCheckinWhereUniqueInput
  }

  /**
   * DailyCheckin deleteMany
   */
  export type DailyCheckinDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyCheckins to delete
     */
    where?: DailyCheckinWhereInput
    /**
     * Limit how many DailyCheckins to delete.
     */
    limit?: number
  }

  /**
   * DailyCheckin without action
   */
  export type DailyCheckinDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyCheckin
     */
    select?: DailyCheckinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyCheckin
     */
    omit?: DailyCheckinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyCheckinInclude<ExtArgs> | null
  }


  /**
   * Model SavedSearch
   */

  export type AggregateSavedSearch = {
    _count: SavedSearchCountAggregateOutputType | null
    _avg: SavedSearchAvgAggregateOutputType | null
    _sum: SavedSearchSumAggregateOutputType | null
    _min: SavedSearchMinAggregateOutputType | null
    _max: SavedSearchMaxAggregateOutputType | null
  }

  export type SavedSearchAvgAggregateOutputType = {
    hoursOld: number | null
  }

  export type SavedSearchSumAggregateOutputType = {
    hoursOld: number | null
  }

  export type SavedSearchMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    query: string | null
    location: string | null
    hoursOld: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SavedSearchMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    query: string | null
    location: string | null
    hoursOld: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SavedSearchCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    query: number
    location: number
    hoursOld: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SavedSearchAvgAggregateInputType = {
    hoursOld?: true
  }

  export type SavedSearchSumAggregateInputType = {
    hoursOld?: true
  }

  export type SavedSearchMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    query?: true
    location?: true
    hoursOld?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SavedSearchMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    query?: true
    location?: true
    hoursOld?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SavedSearchCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    query?: true
    location?: true
    hoursOld?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SavedSearchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedSearch to aggregate.
     */
    where?: SavedSearchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedSearches to fetch.
     */
    orderBy?: SavedSearchOrderByWithRelationInput | SavedSearchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SavedSearchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedSearches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedSearches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SavedSearches
    **/
    _count?: true | SavedSearchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SavedSearchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SavedSearchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SavedSearchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SavedSearchMaxAggregateInputType
  }

  export type GetSavedSearchAggregateType<T extends SavedSearchAggregateArgs> = {
        [P in keyof T & keyof AggregateSavedSearch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSavedSearch[P]>
      : GetScalarType<T[P], AggregateSavedSearch[P]>
  }




  export type SavedSearchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedSearchWhereInput
    orderBy?: SavedSearchOrderByWithAggregationInput | SavedSearchOrderByWithAggregationInput[]
    by: SavedSearchScalarFieldEnum[] | SavedSearchScalarFieldEnum
    having?: SavedSearchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SavedSearchCountAggregateInputType | true
    _avg?: SavedSearchAvgAggregateInputType
    _sum?: SavedSearchSumAggregateInputType
    _min?: SavedSearchMinAggregateInputType
    _max?: SavedSearchMaxAggregateInputType
  }

  export type SavedSearchGroupByOutputType = {
    id: string
    userId: string
    name: string
    query: string
    location: string | null
    hoursOld: number | null
    createdAt: Date
    updatedAt: Date
    _count: SavedSearchCountAggregateOutputType | null
    _avg: SavedSearchAvgAggregateOutputType | null
    _sum: SavedSearchSumAggregateOutputType | null
    _min: SavedSearchMinAggregateOutputType | null
    _max: SavedSearchMaxAggregateOutputType | null
  }

  type GetSavedSearchGroupByPayload<T extends SavedSearchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SavedSearchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SavedSearchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SavedSearchGroupByOutputType[P]>
            : GetScalarType<T[P], SavedSearchGroupByOutputType[P]>
        }
      >
    >


  export type SavedSearchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    query?: boolean
    location?: boolean
    hoursOld?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedSearch"]>

  export type SavedSearchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    query?: boolean
    location?: boolean
    hoursOld?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedSearch"]>

  export type SavedSearchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    query?: boolean
    location?: boolean
    hoursOld?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedSearch"]>

  export type SavedSearchSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    query?: boolean
    location?: boolean
    hoursOld?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SavedSearchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "query" | "location" | "hoursOld" | "createdAt" | "updatedAt", ExtArgs["result"]["savedSearch"]>
  export type SavedSearchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SavedSearchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SavedSearchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SavedSearchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SavedSearch"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      query: string
      location: string | null
      hoursOld: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["savedSearch"]>
    composites: {}
  }

  type SavedSearchGetPayload<S extends boolean | null | undefined | SavedSearchDefaultArgs> = $Result.GetResult<Prisma.$SavedSearchPayload, S>

  type SavedSearchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SavedSearchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SavedSearchCountAggregateInputType | true
    }

  export interface SavedSearchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SavedSearch'], meta: { name: 'SavedSearch' } }
    /**
     * Find zero or one SavedSearch that matches the filter.
     * @param {SavedSearchFindUniqueArgs} args - Arguments to find a SavedSearch
     * @example
     * // Get one SavedSearch
     * const savedSearch = await prisma.savedSearch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SavedSearchFindUniqueArgs>(args: SelectSubset<T, SavedSearchFindUniqueArgs<ExtArgs>>): Prisma__SavedSearchClient<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SavedSearch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SavedSearchFindUniqueOrThrowArgs} args - Arguments to find a SavedSearch
     * @example
     * // Get one SavedSearch
     * const savedSearch = await prisma.savedSearch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SavedSearchFindUniqueOrThrowArgs>(args: SelectSubset<T, SavedSearchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SavedSearchClient<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedSearch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedSearchFindFirstArgs} args - Arguments to find a SavedSearch
     * @example
     * // Get one SavedSearch
     * const savedSearch = await prisma.savedSearch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SavedSearchFindFirstArgs>(args?: SelectSubset<T, SavedSearchFindFirstArgs<ExtArgs>>): Prisma__SavedSearchClient<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedSearch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedSearchFindFirstOrThrowArgs} args - Arguments to find a SavedSearch
     * @example
     * // Get one SavedSearch
     * const savedSearch = await prisma.savedSearch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SavedSearchFindFirstOrThrowArgs>(args?: SelectSubset<T, SavedSearchFindFirstOrThrowArgs<ExtArgs>>): Prisma__SavedSearchClient<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SavedSearches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedSearchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SavedSearches
     * const savedSearches = await prisma.savedSearch.findMany()
     * 
     * // Get first 10 SavedSearches
     * const savedSearches = await prisma.savedSearch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const savedSearchWithIdOnly = await prisma.savedSearch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SavedSearchFindManyArgs>(args?: SelectSubset<T, SavedSearchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SavedSearch.
     * @param {SavedSearchCreateArgs} args - Arguments to create a SavedSearch.
     * @example
     * // Create one SavedSearch
     * const SavedSearch = await prisma.savedSearch.create({
     *   data: {
     *     // ... data to create a SavedSearch
     *   }
     * })
     * 
     */
    create<T extends SavedSearchCreateArgs>(args: SelectSubset<T, SavedSearchCreateArgs<ExtArgs>>): Prisma__SavedSearchClient<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SavedSearches.
     * @param {SavedSearchCreateManyArgs} args - Arguments to create many SavedSearches.
     * @example
     * // Create many SavedSearches
     * const savedSearch = await prisma.savedSearch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SavedSearchCreateManyArgs>(args?: SelectSubset<T, SavedSearchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SavedSearches and returns the data saved in the database.
     * @param {SavedSearchCreateManyAndReturnArgs} args - Arguments to create many SavedSearches.
     * @example
     * // Create many SavedSearches
     * const savedSearch = await prisma.savedSearch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SavedSearches and only return the `id`
     * const savedSearchWithIdOnly = await prisma.savedSearch.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SavedSearchCreateManyAndReturnArgs>(args?: SelectSubset<T, SavedSearchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SavedSearch.
     * @param {SavedSearchDeleteArgs} args - Arguments to delete one SavedSearch.
     * @example
     * // Delete one SavedSearch
     * const SavedSearch = await prisma.savedSearch.delete({
     *   where: {
     *     // ... filter to delete one SavedSearch
     *   }
     * })
     * 
     */
    delete<T extends SavedSearchDeleteArgs>(args: SelectSubset<T, SavedSearchDeleteArgs<ExtArgs>>): Prisma__SavedSearchClient<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SavedSearch.
     * @param {SavedSearchUpdateArgs} args - Arguments to update one SavedSearch.
     * @example
     * // Update one SavedSearch
     * const savedSearch = await prisma.savedSearch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SavedSearchUpdateArgs>(args: SelectSubset<T, SavedSearchUpdateArgs<ExtArgs>>): Prisma__SavedSearchClient<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SavedSearches.
     * @param {SavedSearchDeleteManyArgs} args - Arguments to filter SavedSearches to delete.
     * @example
     * // Delete a few SavedSearches
     * const { count } = await prisma.savedSearch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SavedSearchDeleteManyArgs>(args?: SelectSubset<T, SavedSearchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedSearches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedSearchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SavedSearches
     * const savedSearch = await prisma.savedSearch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SavedSearchUpdateManyArgs>(args: SelectSubset<T, SavedSearchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedSearches and returns the data updated in the database.
     * @param {SavedSearchUpdateManyAndReturnArgs} args - Arguments to update many SavedSearches.
     * @example
     * // Update many SavedSearches
     * const savedSearch = await prisma.savedSearch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SavedSearches and only return the `id`
     * const savedSearchWithIdOnly = await prisma.savedSearch.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SavedSearchUpdateManyAndReturnArgs>(args: SelectSubset<T, SavedSearchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SavedSearch.
     * @param {SavedSearchUpsertArgs} args - Arguments to update or create a SavedSearch.
     * @example
     * // Update or create a SavedSearch
     * const savedSearch = await prisma.savedSearch.upsert({
     *   create: {
     *     // ... data to create a SavedSearch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SavedSearch we want to update
     *   }
     * })
     */
    upsert<T extends SavedSearchUpsertArgs>(args: SelectSubset<T, SavedSearchUpsertArgs<ExtArgs>>): Prisma__SavedSearchClient<$Result.GetResult<Prisma.$SavedSearchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SavedSearches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedSearchCountArgs} args - Arguments to filter SavedSearches to count.
     * @example
     * // Count the number of SavedSearches
     * const count = await prisma.savedSearch.count({
     *   where: {
     *     // ... the filter for the SavedSearches we want to count
     *   }
     * })
    **/
    count<T extends SavedSearchCountArgs>(
      args?: Subset<T, SavedSearchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SavedSearchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SavedSearch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedSearchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SavedSearchAggregateArgs>(args: Subset<T, SavedSearchAggregateArgs>): Prisma.PrismaPromise<GetSavedSearchAggregateType<T>>

    /**
     * Group by SavedSearch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedSearchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SavedSearchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SavedSearchGroupByArgs['orderBy'] }
        : { orderBy?: SavedSearchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SavedSearchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavedSearchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SavedSearch model
   */
  readonly fields: SavedSearchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SavedSearch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SavedSearchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SavedSearch model
   */
  interface SavedSearchFieldRefs {
    readonly id: FieldRef<"SavedSearch", 'String'>
    readonly userId: FieldRef<"SavedSearch", 'String'>
    readonly name: FieldRef<"SavedSearch", 'String'>
    readonly query: FieldRef<"SavedSearch", 'String'>
    readonly location: FieldRef<"SavedSearch", 'String'>
    readonly hoursOld: FieldRef<"SavedSearch", 'Int'>
    readonly createdAt: FieldRef<"SavedSearch", 'DateTime'>
    readonly updatedAt: FieldRef<"SavedSearch", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SavedSearch findUnique
   */
  export type SavedSearchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    /**
     * Filter, which SavedSearch to fetch.
     */
    where: SavedSearchWhereUniqueInput
  }

  /**
   * SavedSearch findUniqueOrThrow
   */
  export type SavedSearchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    /**
     * Filter, which SavedSearch to fetch.
     */
    where: SavedSearchWhereUniqueInput
  }

  /**
   * SavedSearch findFirst
   */
  export type SavedSearchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    /**
     * Filter, which SavedSearch to fetch.
     */
    where?: SavedSearchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedSearches to fetch.
     */
    orderBy?: SavedSearchOrderByWithRelationInput | SavedSearchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedSearches.
     */
    cursor?: SavedSearchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedSearches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedSearches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedSearches.
     */
    distinct?: SavedSearchScalarFieldEnum | SavedSearchScalarFieldEnum[]
  }

  /**
   * SavedSearch findFirstOrThrow
   */
  export type SavedSearchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    /**
     * Filter, which SavedSearch to fetch.
     */
    where?: SavedSearchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedSearches to fetch.
     */
    orderBy?: SavedSearchOrderByWithRelationInput | SavedSearchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedSearches.
     */
    cursor?: SavedSearchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedSearches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedSearches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedSearches.
     */
    distinct?: SavedSearchScalarFieldEnum | SavedSearchScalarFieldEnum[]
  }

  /**
   * SavedSearch findMany
   */
  export type SavedSearchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    /**
     * Filter, which SavedSearches to fetch.
     */
    where?: SavedSearchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedSearches to fetch.
     */
    orderBy?: SavedSearchOrderByWithRelationInput | SavedSearchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SavedSearches.
     */
    cursor?: SavedSearchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedSearches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedSearches.
     */
    skip?: number
    distinct?: SavedSearchScalarFieldEnum | SavedSearchScalarFieldEnum[]
  }

  /**
   * SavedSearch create
   */
  export type SavedSearchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    /**
     * The data needed to create a SavedSearch.
     */
    data: XOR<SavedSearchCreateInput, SavedSearchUncheckedCreateInput>
  }

  /**
   * SavedSearch createMany
   */
  export type SavedSearchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SavedSearches.
     */
    data: SavedSearchCreateManyInput | SavedSearchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SavedSearch createManyAndReturn
   */
  export type SavedSearchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * The data used to create many SavedSearches.
     */
    data: SavedSearchCreateManyInput | SavedSearchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SavedSearch update
   */
  export type SavedSearchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    /**
     * The data needed to update a SavedSearch.
     */
    data: XOR<SavedSearchUpdateInput, SavedSearchUncheckedUpdateInput>
    /**
     * Choose, which SavedSearch to update.
     */
    where: SavedSearchWhereUniqueInput
  }

  /**
   * SavedSearch updateMany
   */
  export type SavedSearchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SavedSearches.
     */
    data: XOR<SavedSearchUpdateManyMutationInput, SavedSearchUncheckedUpdateManyInput>
    /**
     * Filter which SavedSearches to update
     */
    where?: SavedSearchWhereInput
    /**
     * Limit how many SavedSearches to update.
     */
    limit?: number
  }

  /**
   * SavedSearch updateManyAndReturn
   */
  export type SavedSearchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * The data used to update SavedSearches.
     */
    data: XOR<SavedSearchUpdateManyMutationInput, SavedSearchUncheckedUpdateManyInput>
    /**
     * Filter which SavedSearches to update
     */
    where?: SavedSearchWhereInput
    /**
     * Limit how many SavedSearches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SavedSearch upsert
   */
  export type SavedSearchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    /**
     * The filter to search for the SavedSearch to update in case it exists.
     */
    where: SavedSearchWhereUniqueInput
    /**
     * In case the SavedSearch found by the `where` argument doesn't exist, create a new SavedSearch with this data.
     */
    create: XOR<SavedSearchCreateInput, SavedSearchUncheckedCreateInput>
    /**
     * In case the SavedSearch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SavedSearchUpdateInput, SavedSearchUncheckedUpdateInput>
  }

  /**
   * SavedSearch delete
   */
  export type SavedSearchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
    /**
     * Filter which SavedSearch to delete.
     */
    where: SavedSearchWhereUniqueInput
  }

  /**
   * SavedSearch deleteMany
   */
  export type SavedSearchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedSearches to delete
     */
    where?: SavedSearchWhereInput
    /**
     * Limit how many SavedSearches to delete.
     */
    limit?: number
  }

  /**
   * SavedSearch without action
   */
  export type SavedSearchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedSearch
     */
    select?: SavedSearchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedSearch
     */
    omit?: SavedSearchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedSearchInclude<ExtArgs> | null
  }


  /**
   * Model FetchRun
   */

  export type AggregateFetchRun = {
    _count: FetchRunCountAggregateOutputType | null
    _avg: FetchRunAvgAggregateOutputType | null
    _sum: FetchRunSumAggregateOutputType | null
    _min: FetchRunMinAggregateOutputType | null
    _max: FetchRunMaxAggregateOutputType | null
  }

  export type FetchRunAvgAggregateOutputType = {
    importedCount: number | null
    hoursOld: number | null
    resultsWanted: number | null
  }

  export type FetchRunSumAggregateOutputType = {
    importedCount: number | null
    hoursOld: number | null
    resultsWanted: number | null
  }

  export type FetchRunMinAggregateOutputType = {
    id: string | null
    userId: string | null
    userEmail: string | null
    status: $Enums.FetchRunStatus | null
    error: string | null
    importedCount: number | null
    location: string | null
    hoursOld: number | null
    resultsWanted: number | null
    includeFromQueries: boolean | null
    filterDescription: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FetchRunMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    userEmail: string | null
    status: $Enums.FetchRunStatus | null
    error: string | null
    importedCount: number | null
    location: string | null
    hoursOld: number | null
    resultsWanted: number | null
    includeFromQueries: boolean | null
    filterDescription: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FetchRunCountAggregateOutputType = {
    id: number
    userId: number
    userEmail: number
    status: number
    error: number
    importedCount: number
    queries: number
    location: number
    hoursOld: number
    resultsWanted: number
    includeFromQueries: number
    filterDescription: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FetchRunAvgAggregateInputType = {
    importedCount?: true
    hoursOld?: true
    resultsWanted?: true
  }

  export type FetchRunSumAggregateInputType = {
    importedCount?: true
    hoursOld?: true
    resultsWanted?: true
  }

  export type FetchRunMinAggregateInputType = {
    id?: true
    userId?: true
    userEmail?: true
    status?: true
    error?: true
    importedCount?: true
    location?: true
    hoursOld?: true
    resultsWanted?: true
    includeFromQueries?: true
    filterDescription?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FetchRunMaxAggregateInputType = {
    id?: true
    userId?: true
    userEmail?: true
    status?: true
    error?: true
    importedCount?: true
    location?: true
    hoursOld?: true
    resultsWanted?: true
    includeFromQueries?: true
    filterDescription?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FetchRunCountAggregateInputType = {
    id?: true
    userId?: true
    userEmail?: true
    status?: true
    error?: true
    importedCount?: true
    queries?: true
    location?: true
    hoursOld?: true
    resultsWanted?: true
    includeFromQueries?: true
    filterDescription?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FetchRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FetchRun to aggregate.
     */
    where?: FetchRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FetchRuns to fetch.
     */
    orderBy?: FetchRunOrderByWithRelationInput | FetchRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FetchRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FetchRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FetchRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FetchRuns
    **/
    _count?: true | FetchRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FetchRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FetchRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FetchRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FetchRunMaxAggregateInputType
  }

  export type GetFetchRunAggregateType<T extends FetchRunAggregateArgs> = {
        [P in keyof T & keyof AggregateFetchRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFetchRun[P]>
      : GetScalarType<T[P], AggregateFetchRun[P]>
  }




  export type FetchRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FetchRunWhereInput
    orderBy?: FetchRunOrderByWithAggregationInput | FetchRunOrderByWithAggregationInput[]
    by: FetchRunScalarFieldEnum[] | FetchRunScalarFieldEnum
    having?: FetchRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FetchRunCountAggregateInputType | true
    _avg?: FetchRunAvgAggregateInputType
    _sum?: FetchRunSumAggregateInputType
    _min?: FetchRunMinAggregateInputType
    _max?: FetchRunMaxAggregateInputType
  }

  export type FetchRunGroupByOutputType = {
    id: string
    userId: string
    userEmail: string
    status: $Enums.FetchRunStatus
    error: string | null
    importedCount: number
    queries: JsonValue
    location: string | null
    hoursOld: number | null
    resultsWanted: number | null
    includeFromQueries: boolean
    filterDescription: boolean
    createdAt: Date
    updatedAt: Date
    _count: FetchRunCountAggregateOutputType | null
    _avg: FetchRunAvgAggregateOutputType | null
    _sum: FetchRunSumAggregateOutputType | null
    _min: FetchRunMinAggregateOutputType | null
    _max: FetchRunMaxAggregateOutputType | null
  }

  type GetFetchRunGroupByPayload<T extends FetchRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FetchRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FetchRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FetchRunGroupByOutputType[P]>
            : GetScalarType<T[P], FetchRunGroupByOutputType[P]>
        }
      >
    >


  export type FetchRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    status?: boolean
    error?: boolean
    importedCount?: boolean
    queries?: boolean
    location?: boolean
    hoursOld?: boolean
    resultsWanted?: boolean
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fetchRun"]>

  export type FetchRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    status?: boolean
    error?: boolean
    importedCount?: boolean
    queries?: boolean
    location?: boolean
    hoursOld?: boolean
    resultsWanted?: boolean
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fetchRun"]>

  export type FetchRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    status?: boolean
    error?: boolean
    importedCount?: boolean
    queries?: boolean
    location?: boolean
    hoursOld?: boolean
    resultsWanted?: boolean
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fetchRun"]>

  export type FetchRunSelectScalar = {
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    status?: boolean
    error?: boolean
    importedCount?: boolean
    queries?: boolean
    location?: boolean
    hoursOld?: boolean
    resultsWanted?: boolean
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FetchRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "userEmail" | "status" | "error" | "importedCount" | "queries" | "location" | "hoursOld" | "resultsWanted" | "includeFromQueries" | "filterDescription" | "createdAt" | "updatedAt", ExtArgs["result"]["fetchRun"]>
  export type FetchRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FetchRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FetchRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FetchRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FetchRun"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      userEmail: string
      status: $Enums.FetchRunStatus
      error: string | null
      importedCount: number
      queries: Prisma.JsonValue
      location: string | null
      hoursOld: number | null
      resultsWanted: number | null
      includeFromQueries: boolean
      filterDescription: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fetchRun"]>
    composites: {}
  }

  type FetchRunGetPayload<S extends boolean | null | undefined | FetchRunDefaultArgs> = $Result.GetResult<Prisma.$FetchRunPayload, S>

  type FetchRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FetchRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FetchRunCountAggregateInputType | true
    }

  export interface FetchRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FetchRun'], meta: { name: 'FetchRun' } }
    /**
     * Find zero or one FetchRun that matches the filter.
     * @param {FetchRunFindUniqueArgs} args - Arguments to find a FetchRun
     * @example
     * // Get one FetchRun
     * const fetchRun = await prisma.fetchRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FetchRunFindUniqueArgs>(args: SelectSubset<T, FetchRunFindUniqueArgs<ExtArgs>>): Prisma__FetchRunClient<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FetchRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FetchRunFindUniqueOrThrowArgs} args - Arguments to find a FetchRun
     * @example
     * // Get one FetchRun
     * const fetchRun = await prisma.fetchRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FetchRunFindUniqueOrThrowArgs>(args: SelectSubset<T, FetchRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FetchRunClient<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FetchRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchRunFindFirstArgs} args - Arguments to find a FetchRun
     * @example
     * // Get one FetchRun
     * const fetchRun = await prisma.fetchRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FetchRunFindFirstArgs>(args?: SelectSubset<T, FetchRunFindFirstArgs<ExtArgs>>): Prisma__FetchRunClient<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FetchRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchRunFindFirstOrThrowArgs} args - Arguments to find a FetchRun
     * @example
     * // Get one FetchRun
     * const fetchRun = await prisma.fetchRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FetchRunFindFirstOrThrowArgs>(args?: SelectSubset<T, FetchRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__FetchRunClient<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FetchRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FetchRuns
     * const fetchRuns = await prisma.fetchRun.findMany()
     * 
     * // Get first 10 FetchRuns
     * const fetchRuns = await prisma.fetchRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fetchRunWithIdOnly = await prisma.fetchRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FetchRunFindManyArgs>(args?: SelectSubset<T, FetchRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FetchRun.
     * @param {FetchRunCreateArgs} args - Arguments to create a FetchRun.
     * @example
     * // Create one FetchRun
     * const FetchRun = await prisma.fetchRun.create({
     *   data: {
     *     // ... data to create a FetchRun
     *   }
     * })
     * 
     */
    create<T extends FetchRunCreateArgs>(args: SelectSubset<T, FetchRunCreateArgs<ExtArgs>>): Prisma__FetchRunClient<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FetchRuns.
     * @param {FetchRunCreateManyArgs} args - Arguments to create many FetchRuns.
     * @example
     * // Create many FetchRuns
     * const fetchRun = await prisma.fetchRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FetchRunCreateManyArgs>(args?: SelectSubset<T, FetchRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FetchRuns and returns the data saved in the database.
     * @param {FetchRunCreateManyAndReturnArgs} args - Arguments to create many FetchRuns.
     * @example
     * // Create many FetchRuns
     * const fetchRun = await prisma.fetchRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FetchRuns and only return the `id`
     * const fetchRunWithIdOnly = await prisma.fetchRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FetchRunCreateManyAndReturnArgs>(args?: SelectSubset<T, FetchRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FetchRun.
     * @param {FetchRunDeleteArgs} args - Arguments to delete one FetchRun.
     * @example
     * // Delete one FetchRun
     * const FetchRun = await prisma.fetchRun.delete({
     *   where: {
     *     // ... filter to delete one FetchRun
     *   }
     * })
     * 
     */
    delete<T extends FetchRunDeleteArgs>(args: SelectSubset<T, FetchRunDeleteArgs<ExtArgs>>): Prisma__FetchRunClient<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FetchRun.
     * @param {FetchRunUpdateArgs} args - Arguments to update one FetchRun.
     * @example
     * // Update one FetchRun
     * const fetchRun = await prisma.fetchRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FetchRunUpdateArgs>(args: SelectSubset<T, FetchRunUpdateArgs<ExtArgs>>): Prisma__FetchRunClient<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FetchRuns.
     * @param {FetchRunDeleteManyArgs} args - Arguments to filter FetchRuns to delete.
     * @example
     * // Delete a few FetchRuns
     * const { count } = await prisma.fetchRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FetchRunDeleteManyArgs>(args?: SelectSubset<T, FetchRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FetchRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FetchRuns
     * const fetchRun = await prisma.fetchRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FetchRunUpdateManyArgs>(args: SelectSubset<T, FetchRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FetchRuns and returns the data updated in the database.
     * @param {FetchRunUpdateManyAndReturnArgs} args - Arguments to update many FetchRuns.
     * @example
     * // Update many FetchRuns
     * const fetchRun = await prisma.fetchRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FetchRuns and only return the `id`
     * const fetchRunWithIdOnly = await prisma.fetchRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FetchRunUpdateManyAndReturnArgs>(args: SelectSubset<T, FetchRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FetchRun.
     * @param {FetchRunUpsertArgs} args - Arguments to update or create a FetchRun.
     * @example
     * // Update or create a FetchRun
     * const fetchRun = await prisma.fetchRun.upsert({
     *   create: {
     *     // ... data to create a FetchRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FetchRun we want to update
     *   }
     * })
     */
    upsert<T extends FetchRunUpsertArgs>(args: SelectSubset<T, FetchRunUpsertArgs<ExtArgs>>): Prisma__FetchRunClient<$Result.GetResult<Prisma.$FetchRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FetchRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchRunCountArgs} args - Arguments to filter FetchRuns to count.
     * @example
     * // Count the number of FetchRuns
     * const count = await prisma.fetchRun.count({
     *   where: {
     *     // ... the filter for the FetchRuns we want to count
     *   }
     * })
    **/
    count<T extends FetchRunCountArgs>(
      args?: Subset<T, FetchRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FetchRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FetchRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FetchRunAggregateArgs>(args: Subset<T, FetchRunAggregateArgs>): Prisma.PrismaPromise<GetFetchRunAggregateType<T>>

    /**
     * Group by FetchRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FetchRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FetchRunGroupByArgs['orderBy'] }
        : { orderBy?: FetchRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FetchRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFetchRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FetchRun model
   */
  readonly fields: FetchRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FetchRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FetchRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FetchRun model
   */
  interface FetchRunFieldRefs {
    readonly id: FieldRef<"FetchRun", 'String'>
    readonly userId: FieldRef<"FetchRun", 'String'>
    readonly userEmail: FieldRef<"FetchRun", 'String'>
    readonly status: FieldRef<"FetchRun", 'FetchRunStatus'>
    readonly error: FieldRef<"FetchRun", 'String'>
    readonly importedCount: FieldRef<"FetchRun", 'Int'>
    readonly queries: FieldRef<"FetchRun", 'Json'>
    readonly location: FieldRef<"FetchRun", 'String'>
    readonly hoursOld: FieldRef<"FetchRun", 'Int'>
    readonly resultsWanted: FieldRef<"FetchRun", 'Int'>
    readonly includeFromQueries: FieldRef<"FetchRun", 'Boolean'>
    readonly filterDescription: FieldRef<"FetchRun", 'Boolean'>
    readonly createdAt: FieldRef<"FetchRun", 'DateTime'>
    readonly updatedAt: FieldRef<"FetchRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FetchRun findUnique
   */
  export type FetchRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    /**
     * Filter, which FetchRun to fetch.
     */
    where: FetchRunWhereUniqueInput
  }

  /**
   * FetchRun findUniqueOrThrow
   */
  export type FetchRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    /**
     * Filter, which FetchRun to fetch.
     */
    where: FetchRunWhereUniqueInput
  }

  /**
   * FetchRun findFirst
   */
  export type FetchRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    /**
     * Filter, which FetchRun to fetch.
     */
    where?: FetchRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FetchRuns to fetch.
     */
    orderBy?: FetchRunOrderByWithRelationInput | FetchRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FetchRuns.
     */
    cursor?: FetchRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FetchRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FetchRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FetchRuns.
     */
    distinct?: FetchRunScalarFieldEnum | FetchRunScalarFieldEnum[]
  }

  /**
   * FetchRun findFirstOrThrow
   */
  export type FetchRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    /**
     * Filter, which FetchRun to fetch.
     */
    where?: FetchRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FetchRuns to fetch.
     */
    orderBy?: FetchRunOrderByWithRelationInput | FetchRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FetchRuns.
     */
    cursor?: FetchRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FetchRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FetchRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FetchRuns.
     */
    distinct?: FetchRunScalarFieldEnum | FetchRunScalarFieldEnum[]
  }

  /**
   * FetchRun findMany
   */
  export type FetchRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    /**
     * Filter, which FetchRuns to fetch.
     */
    where?: FetchRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FetchRuns to fetch.
     */
    orderBy?: FetchRunOrderByWithRelationInput | FetchRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FetchRuns.
     */
    cursor?: FetchRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FetchRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FetchRuns.
     */
    skip?: number
    distinct?: FetchRunScalarFieldEnum | FetchRunScalarFieldEnum[]
  }

  /**
   * FetchRun create
   */
  export type FetchRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    /**
     * The data needed to create a FetchRun.
     */
    data: XOR<FetchRunCreateInput, FetchRunUncheckedCreateInput>
  }

  /**
   * FetchRun createMany
   */
  export type FetchRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FetchRuns.
     */
    data: FetchRunCreateManyInput | FetchRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FetchRun createManyAndReturn
   */
  export type FetchRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * The data used to create many FetchRuns.
     */
    data: FetchRunCreateManyInput | FetchRunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FetchRun update
   */
  export type FetchRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    /**
     * The data needed to update a FetchRun.
     */
    data: XOR<FetchRunUpdateInput, FetchRunUncheckedUpdateInput>
    /**
     * Choose, which FetchRun to update.
     */
    where: FetchRunWhereUniqueInput
  }

  /**
   * FetchRun updateMany
   */
  export type FetchRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FetchRuns.
     */
    data: XOR<FetchRunUpdateManyMutationInput, FetchRunUncheckedUpdateManyInput>
    /**
     * Filter which FetchRuns to update
     */
    where?: FetchRunWhereInput
    /**
     * Limit how many FetchRuns to update.
     */
    limit?: number
  }

  /**
   * FetchRun updateManyAndReturn
   */
  export type FetchRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * The data used to update FetchRuns.
     */
    data: XOR<FetchRunUpdateManyMutationInput, FetchRunUncheckedUpdateManyInput>
    /**
     * Filter which FetchRuns to update
     */
    where?: FetchRunWhereInput
    /**
     * Limit how many FetchRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FetchRun upsert
   */
  export type FetchRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    /**
     * The filter to search for the FetchRun to update in case it exists.
     */
    where: FetchRunWhereUniqueInput
    /**
     * In case the FetchRun found by the `where` argument doesn't exist, create a new FetchRun with this data.
     */
    create: XOR<FetchRunCreateInput, FetchRunUncheckedCreateInput>
    /**
     * In case the FetchRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FetchRunUpdateInput, FetchRunUncheckedUpdateInput>
  }

  /**
   * FetchRun delete
   */
  export type FetchRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
    /**
     * Filter which FetchRun to delete.
     */
    where: FetchRunWhereUniqueInput
  }

  /**
   * FetchRun deleteMany
   */
  export type FetchRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FetchRuns to delete
     */
    where?: FetchRunWhereInput
    /**
     * Limit how many FetchRuns to delete.
     */
    limit?: number
  }

  /**
   * FetchRun without action
   */
  export type FetchRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchRun
     */
    select?: FetchRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchRun
     */
    omit?: FetchRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FetchRunInclude<ExtArgs> | null
  }


  /**
   * Model ResumeProfile
   */

  export type AggregateResumeProfile = {
    _count: ResumeProfileCountAggregateOutputType | null
    _min: ResumeProfileMinAggregateOutputType | null
    _max: ResumeProfileMaxAggregateOutputType | null
  }

  export type ResumeProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    summary: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ResumeProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    summary: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ResumeProfileCountAggregateOutputType = {
    id: number
    userId: number
    summary: number
    basics: number
    links: number
    skills: number
    experiences: number
    projects: number
    education: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ResumeProfileMinAggregateInputType = {
    id?: true
    userId?: true
    summary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ResumeProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    summary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ResumeProfileCountAggregateInputType = {
    id?: true
    userId?: true
    summary?: true
    basics?: true
    links?: true
    skills?: true
    experiences?: true
    projects?: true
    education?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ResumeProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResumeProfile to aggregate.
     */
    where?: ResumeProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumeProfiles to fetch.
     */
    orderBy?: ResumeProfileOrderByWithRelationInput | ResumeProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResumeProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumeProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumeProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ResumeProfiles
    **/
    _count?: true | ResumeProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResumeProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResumeProfileMaxAggregateInputType
  }

  export type GetResumeProfileAggregateType<T extends ResumeProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateResumeProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResumeProfile[P]>
      : GetScalarType<T[P], AggregateResumeProfile[P]>
  }




  export type ResumeProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeProfileWhereInput
    orderBy?: ResumeProfileOrderByWithAggregationInput | ResumeProfileOrderByWithAggregationInput[]
    by: ResumeProfileScalarFieldEnum[] | ResumeProfileScalarFieldEnum
    having?: ResumeProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResumeProfileCountAggregateInputType | true
    _min?: ResumeProfileMinAggregateInputType
    _max?: ResumeProfileMaxAggregateInputType
  }

  export type ResumeProfileGroupByOutputType = {
    id: string
    userId: string
    summary: string | null
    basics: JsonValue | null
    links: JsonValue | null
    skills: JsonValue | null
    experiences: JsonValue | null
    projects: JsonValue | null
    education: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ResumeProfileCountAggregateOutputType | null
    _min: ResumeProfileMinAggregateOutputType | null
    _max: ResumeProfileMaxAggregateOutputType | null
  }

  type GetResumeProfileGroupByPayload<T extends ResumeProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResumeProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResumeProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResumeProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ResumeProfileGroupByOutputType[P]>
        }
      >
    >


  export type ResumeProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    summary?: boolean
    basics?: boolean
    links?: boolean
    skills?: boolean
    experiences?: boolean
    projects?: boolean
    education?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    applications?: boolean | ResumeProfile$applicationsArgs<ExtArgs>
    _count?: boolean | ResumeProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumeProfile"]>

  export type ResumeProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    summary?: boolean
    basics?: boolean
    links?: boolean
    skills?: boolean
    experiences?: boolean
    projects?: boolean
    education?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumeProfile"]>

  export type ResumeProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    summary?: boolean
    basics?: boolean
    links?: boolean
    skills?: boolean
    experiences?: boolean
    projects?: boolean
    education?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumeProfile"]>

  export type ResumeProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    summary?: boolean
    basics?: boolean
    links?: boolean
    skills?: boolean
    experiences?: boolean
    projects?: boolean
    education?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ResumeProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "summary" | "basics" | "links" | "skills" | "experiences" | "projects" | "education" | "createdAt" | "updatedAt", ExtArgs["result"]["resumeProfile"]>
  export type ResumeProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    applications?: boolean | ResumeProfile$applicationsArgs<ExtArgs>
    _count?: boolean | ResumeProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ResumeProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ResumeProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ResumeProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ResumeProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      summary: string | null
      basics: Prisma.JsonValue | null
      links: Prisma.JsonValue | null
      skills: Prisma.JsonValue | null
      experiences: Prisma.JsonValue | null
      projects: Prisma.JsonValue | null
      education: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["resumeProfile"]>
    composites: {}
  }

  type ResumeProfileGetPayload<S extends boolean | null | undefined | ResumeProfileDefaultArgs> = $Result.GetResult<Prisma.$ResumeProfilePayload, S>

  type ResumeProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResumeProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResumeProfileCountAggregateInputType | true
    }

  export interface ResumeProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ResumeProfile'], meta: { name: 'ResumeProfile' } }
    /**
     * Find zero or one ResumeProfile that matches the filter.
     * @param {ResumeProfileFindUniqueArgs} args - Arguments to find a ResumeProfile
     * @example
     * // Get one ResumeProfile
     * const resumeProfile = await prisma.resumeProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResumeProfileFindUniqueArgs>(args: SelectSubset<T, ResumeProfileFindUniqueArgs<ExtArgs>>): Prisma__ResumeProfileClient<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ResumeProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResumeProfileFindUniqueOrThrowArgs} args - Arguments to find a ResumeProfile
     * @example
     * // Get one ResumeProfile
     * const resumeProfile = await prisma.resumeProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResumeProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ResumeProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResumeProfileClient<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResumeProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeProfileFindFirstArgs} args - Arguments to find a ResumeProfile
     * @example
     * // Get one ResumeProfile
     * const resumeProfile = await prisma.resumeProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResumeProfileFindFirstArgs>(args?: SelectSubset<T, ResumeProfileFindFirstArgs<ExtArgs>>): Prisma__ResumeProfileClient<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResumeProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeProfileFindFirstOrThrowArgs} args - Arguments to find a ResumeProfile
     * @example
     * // Get one ResumeProfile
     * const resumeProfile = await prisma.resumeProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResumeProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ResumeProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResumeProfileClient<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ResumeProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ResumeProfiles
     * const resumeProfiles = await prisma.resumeProfile.findMany()
     * 
     * // Get first 10 ResumeProfiles
     * const resumeProfiles = await prisma.resumeProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resumeProfileWithIdOnly = await prisma.resumeProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResumeProfileFindManyArgs>(args?: SelectSubset<T, ResumeProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ResumeProfile.
     * @param {ResumeProfileCreateArgs} args - Arguments to create a ResumeProfile.
     * @example
     * // Create one ResumeProfile
     * const ResumeProfile = await prisma.resumeProfile.create({
     *   data: {
     *     // ... data to create a ResumeProfile
     *   }
     * })
     * 
     */
    create<T extends ResumeProfileCreateArgs>(args: SelectSubset<T, ResumeProfileCreateArgs<ExtArgs>>): Prisma__ResumeProfileClient<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ResumeProfiles.
     * @param {ResumeProfileCreateManyArgs} args - Arguments to create many ResumeProfiles.
     * @example
     * // Create many ResumeProfiles
     * const resumeProfile = await prisma.resumeProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResumeProfileCreateManyArgs>(args?: SelectSubset<T, ResumeProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ResumeProfiles and returns the data saved in the database.
     * @param {ResumeProfileCreateManyAndReturnArgs} args - Arguments to create many ResumeProfiles.
     * @example
     * // Create many ResumeProfiles
     * const resumeProfile = await prisma.resumeProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ResumeProfiles and only return the `id`
     * const resumeProfileWithIdOnly = await prisma.resumeProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResumeProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ResumeProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ResumeProfile.
     * @param {ResumeProfileDeleteArgs} args - Arguments to delete one ResumeProfile.
     * @example
     * // Delete one ResumeProfile
     * const ResumeProfile = await prisma.resumeProfile.delete({
     *   where: {
     *     // ... filter to delete one ResumeProfile
     *   }
     * })
     * 
     */
    delete<T extends ResumeProfileDeleteArgs>(args: SelectSubset<T, ResumeProfileDeleteArgs<ExtArgs>>): Prisma__ResumeProfileClient<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ResumeProfile.
     * @param {ResumeProfileUpdateArgs} args - Arguments to update one ResumeProfile.
     * @example
     * // Update one ResumeProfile
     * const resumeProfile = await prisma.resumeProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResumeProfileUpdateArgs>(args: SelectSubset<T, ResumeProfileUpdateArgs<ExtArgs>>): Prisma__ResumeProfileClient<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ResumeProfiles.
     * @param {ResumeProfileDeleteManyArgs} args - Arguments to filter ResumeProfiles to delete.
     * @example
     * // Delete a few ResumeProfiles
     * const { count } = await prisma.resumeProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResumeProfileDeleteManyArgs>(args?: SelectSubset<T, ResumeProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResumeProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ResumeProfiles
     * const resumeProfile = await prisma.resumeProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResumeProfileUpdateManyArgs>(args: SelectSubset<T, ResumeProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResumeProfiles and returns the data updated in the database.
     * @param {ResumeProfileUpdateManyAndReturnArgs} args - Arguments to update many ResumeProfiles.
     * @example
     * // Update many ResumeProfiles
     * const resumeProfile = await prisma.resumeProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ResumeProfiles and only return the `id`
     * const resumeProfileWithIdOnly = await prisma.resumeProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResumeProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ResumeProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ResumeProfile.
     * @param {ResumeProfileUpsertArgs} args - Arguments to update or create a ResumeProfile.
     * @example
     * // Update or create a ResumeProfile
     * const resumeProfile = await prisma.resumeProfile.upsert({
     *   create: {
     *     // ... data to create a ResumeProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ResumeProfile we want to update
     *   }
     * })
     */
    upsert<T extends ResumeProfileUpsertArgs>(args: SelectSubset<T, ResumeProfileUpsertArgs<ExtArgs>>): Prisma__ResumeProfileClient<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ResumeProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeProfileCountArgs} args - Arguments to filter ResumeProfiles to count.
     * @example
     * // Count the number of ResumeProfiles
     * const count = await prisma.resumeProfile.count({
     *   where: {
     *     // ... the filter for the ResumeProfiles we want to count
     *   }
     * })
    **/
    count<T extends ResumeProfileCountArgs>(
      args?: Subset<T, ResumeProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResumeProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ResumeProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResumeProfileAggregateArgs>(args: Subset<T, ResumeProfileAggregateArgs>): Prisma.PrismaPromise<GetResumeProfileAggregateType<T>>

    /**
     * Group by ResumeProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResumeProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResumeProfileGroupByArgs['orderBy'] }
        : { orderBy?: ResumeProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResumeProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResumeProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ResumeProfile model
   */
  readonly fields: ResumeProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ResumeProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResumeProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    applications<T extends ResumeProfile$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, ResumeProfile$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ResumeProfile model
   */
  interface ResumeProfileFieldRefs {
    readonly id: FieldRef<"ResumeProfile", 'String'>
    readonly userId: FieldRef<"ResumeProfile", 'String'>
    readonly summary: FieldRef<"ResumeProfile", 'String'>
    readonly basics: FieldRef<"ResumeProfile", 'Json'>
    readonly links: FieldRef<"ResumeProfile", 'Json'>
    readonly skills: FieldRef<"ResumeProfile", 'Json'>
    readonly experiences: FieldRef<"ResumeProfile", 'Json'>
    readonly projects: FieldRef<"ResumeProfile", 'Json'>
    readonly education: FieldRef<"ResumeProfile", 'Json'>
    readonly createdAt: FieldRef<"ResumeProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"ResumeProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ResumeProfile findUnique
   */
  export type ResumeProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResumeProfile to fetch.
     */
    where: ResumeProfileWhereUniqueInput
  }

  /**
   * ResumeProfile findUniqueOrThrow
   */
  export type ResumeProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResumeProfile to fetch.
     */
    where: ResumeProfileWhereUniqueInput
  }

  /**
   * ResumeProfile findFirst
   */
  export type ResumeProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResumeProfile to fetch.
     */
    where?: ResumeProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumeProfiles to fetch.
     */
    orderBy?: ResumeProfileOrderByWithRelationInput | ResumeProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResumeProfiles.
     */
    cursor?: ResumeProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumeProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumeProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResumeProfiles.
     */
    distinct?: ResumeProfileScalarFieldEnum | ResumeProfileScalarFieldEnum[]
  }

  /**
   * ResumeProfile findFirstOrThrow
   */
  export type ResumeProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResumeProfile to fetch.
     */
    where?: ResumeProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumeProfiles to fetch.
     */
    orderBy?: ResumeProfileOrderByWithRelationInput | ResumeProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResumeProfiles.
     */
    cursor?: ResumeProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumeProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumeProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResumeProfiles.
     */
    distinct?: ResumeProfileScalarFieldEnum | ResumeProfileScalarFieldEnum[]
  }

  /**
   * ResumeProfile findMany
   */
  export type ResumeProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResumeProfiles to fetch.
     */
    where?: ResumeProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumeProfiles to fetch.
     */
    orderBy?: ResumeProfileOrderByWithRelationInput | ResumeProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ResumeProfiles.
     */
    cursor?: ResumeProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumeProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumeProfiles.
     */
    skip?: number
    distinct?: ResumeProfileScalarFieldEnum | ResumeProfileScalarFieldEnum[]
  }

  /**
   * ResumeProfile create
   */
  export type ResumeProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a ResumeProfile.
     */
    data: XOR<ResumeProfileCreateInput, ResumeProfileUncheckedCreateInput>
  }

  /**
   * ResumeProfile createMany
   */
  export type ResumeProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ResumeProfiles.
     */
    data: ResumeProfileCreateManyInput | ResumeProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ResumeProfile createManyAndReturn
   */
  export type ResumeProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * The data used to create many ResumeProfiles.
     */
    data: ResumeProfileCreateManyInput | ResumeProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResumeProfile update
   */
  export type ResumeProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a ResumeProfile.
     */
    data: XOR<ResumeProfileUpdateInput, ResumeProfileUncheckedUpdateInput>
    /**
     * Choose, which ResumeProfile to update.
     */
    where: ResumeProfileWhereUniqueInput
  }

  /**
   * ResumeProfile updateMany
   */
  export type ResumeProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ResumeProfiles.
     */
    data: XOR<ResumeProfileUpdateManyMutationInput, ResumeProfileUncheckedUpdateManyInput>
    /**
     * Filter which ResumeProfiles to update
     */
    where?: ResumeProfileWhereInput
    /**
     * Limit how many ResumeProfiles to update.
     */
    limit?: number
  }

  /**
   * ResumeProfile updateManyAndReturn
   */
  export type ResumeProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * The data used to update ResumeProfiles.
     */
    data: XOR<ResumeProfileUpdateManyMutationInput, ResumeProfileUncheckedUpdateManyInput>
    /**
     * Filter which ResumeProfiles to update
     */
    where?: ResumeProfileWhereInput
    /**
     * Limit how many ResumeProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResumeProfile upsert
   */
  export type ResumeProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the ResumeProfile to update in case it exists.
     */
    where: ResumeProfileWhereUniqueInput
    /**
     * In case the ResumeProfile found by the `where` argument doesn't exist, create a new ResumeProfile with this data.
     */
    create: XOR<ResumeProfileCreateInput, ResumeProfileUncheckedCreateInput>
    /**
     * In case the ResumeProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResumeProfileUpdateInput, ResumeProfileUncheckedUpdateInput>
  }

  /**
   * ResumeProfile delete
   */
  export type ResumeProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    /**
     * Filter which ResumeProfile to delete.
     */
    where: ResumeProfileWhereUniqueInput
  }

  /**
   * ResumeProfile deleteMany
   */
  export type ResumeProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResumeProfiles to delete
     */
    where?: ResumeProfileWhereInput
    /**
     * Limit how many ResumeProfiles to delete.
     */
    limit?: number
  }

  /**
   * ResumeProfile.applications
   */
  export type ResumeProfile$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * ResumeProfile without action
   */
  export type ResumeProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
  }


  /**
   * Model AiPromptProfile
   */

  export type AggregateAiPromptProfile = {
    _count: AiPromptProfileCountAggregateOutputType | null
    _min: AiPromptProfileMinAggregateOutputType | null
    _max: AiPromptProfileMaxAggregateOutputType | null
  }

  export type AiPromptProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiPromptProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiPromptProfileCountAggregateOutputType = {
    id: number
    userId: number
    cvRules: number
    coverRules: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiPromptProfileMinAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiPromptProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiPromptProfileCountAggregateInputType = {
    id?: true
    userId?: true
    cvRules?: true
    coverRules?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiPromptProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiPromptProfile to aggregate.
     */
    where?: AiPromptProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPromptProfiles to fetch.
     */
    orderBy?: AiPromptProfileOrderByWithRelationInput | AiPromptProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiPromptProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPromptProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPromptProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiPromptProfiles
    **/
    _count?: true | AiPromptProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiPromptProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiPromptProfileMaxAggregateInputType
  }

  export type GetAiPromptProfileAggregateType<T extends AiPromptProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateAiPromptProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiPromptProfile[P]>
      : GetScalarType<T[P], AggregateAiPromptProfile[P]>
  }




  export type AiPromptProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiPromptProfileWhereInput
    orderBy?: AiPromptProfileOrderByWithAggregationInput | AiPromptProfileOrderByWithAggregationInput[]
    by: AiPromptProfileScalarFieldEnum[] | AiPromptProfileScalarFieldEnum
    having?: AiPromptProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiPromptProfileCountAggregateInputType | true
    _min?: AiPromptProfileMinAggregateInputType
    _max?: AiPromptProfileMaxAggregateInputType
  }

  export type AiPromptProfileGroupByOutputType = {
    id: string
    userId: string
    cvRules: JsonValue
    coverRules: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: AiPromptProfileCountAggregateOutputType | null
    _min: AiPromptProfileMinAggregateOutputType | null
    _max: AiPromptProfileMaxAggregateOutputType | null
  }

  type GetAiPromptProfileGroupByPayload<T extends AiPromptProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiPromptProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiPromptProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiPromptProfileGroupByOutputType[P]>
            : GetScalarType<T[P], AiPromptProfileGroupByOutputType[P]>
        }
      >
    >


  export type AiPromptProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    cvRules?: boolean
    coverRules?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiPromptProfile"]>

  export type AiPromptProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    cvRules?: boolean
    coverRules?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiPromptProfile"]>

  export type AiPromptProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    cvRules?: boolean
    coverRules?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiPromptProfile"]>

  export type AiPromptProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    cvRules?: boolean
    coverRules?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AiPromptProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "cvRules" | "coverRules" | "createdAt" | "updatedAt", ExtArgs["result"]["aiPromptProfile"]>
  export type AiPromptProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AiPromptProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AiPromptProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AiPromptProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiPromptProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      cvRules: Prisma.JsonValue
      coverRules: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiPromptProfile"]>
    composites: {}
  }

  type AiPromptProfileGetPayload<S extends boolean | null | undefined | AiPromptProfileDefaultArgs> = $Result.GetResult<Prisma.$AiPromptProfilePayload, S>

  type AiPromptProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiPromptProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiPromptProfileCountAggregateInputType | true
    }

  export interface AiPromptProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiPromptProfile'], meta: { name: 'AiPromptProfile' } }
    /**
     * Find zero or one AiPromptProfile that matches the filter.
     * @param {AiPromptProfileFindUniqueArgs} args - Arguments to find a AiPromptProfile
     * @example
     * // Get one AiPromptProfile
     * const aiPromptProfile = await prisma.aiPromptProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiPromptProfileFindUniqueArgs>(args: SelectSubset<T, AiPromptProfileFindUniqueArgs<ExtArgs>>): Prisma__AiPromptProfileClient<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiPromptProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiPromptProfileFindUniqueOrThrowArgs} args - Arguments to find a AiPromptProfile
     * @example
     * // Get one AiPromptProfile
     * const aiPromptProfile = await prisma.aiPromptProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiPromptProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, AiPromptProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiPromptProfileClient<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiPromptProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptProfileFindFirstArgs} args - Arguments to find a AiPromptProfile
     * @example
     * // Get one AiPromptProfile
     * const aiPromptProfile = await prisma.aiPromptProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiPromptProfileFindFirstArgs>(args?: SelectSubset<T, AiPromptProfileFindFirstArgs<ExtArgs>>): Prisma__AiPromptProfileClient<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiPromptProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptProfileFindFirstOrThrowArgs} args - Arguments to find a AiPromptProfile
     * @example
     * // Get one AiPromptProfile
     * const aiPromptProfile = await prisma.aiPromptProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiPromptProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, AiPromptProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiPromptProfileClient<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiPromptProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiPromptProfiles
     * const aiPromptProfiles = await prisma.aiPromptProfile.findMany()
     * 
     * // Get first 10 AiPromptProfiles
     * const aiPromptProfiles = await prisma.aiPromptProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiPromptProfileWithIdOnly = await prisma.aiPromptProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiPromptProfileFindManyArgs>(args?: SelectSubset<T, AiPromptProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiPromptProfile.
     * @param {AiPromptProfileCreateArgs} args - Arguments to create a AiPromptProfile.
     * @example
     * // Create one AiPromptProfile
     * const AiPromptProfile = await prisma.aiPromptProfile.create({
     *   data: {
     *     // ... data to create a AiPromptProfile
     *   }
     * })
     * 
     */
    create<T extends AiPromptProfileCreateArgs>(args: SelectSubset<T, AiPromptProfileCreateArgs<ExtArgs>>): Prisma__AiPromptProfileClient<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiPromptProfiles.
     * @param {AiPromptProfileCreateManyArgs} args - Arguments to create many AiPromptProfiles.
     * @example
     * // Create many AiPromptProfiles
     * const aiPromptProfile = await prisma.aiPromptProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiPromptProfileCreateManyArgs>(args?: SelectSubset<T, AiPromptProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiPromptProfiles and returns the data saved in the database.
     * @param {AiPromptProfileCreateManyAndReturnArgs} args - Arguments to create many AiPromptProfiles.
     * @example
     * // Create many AiPromptProfiles
     * const aiPromptProfile = await prisma.aiPromptProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiPromptProfiles and only return the `id`
     * const aiPromptProfileWithIdOnly = await prisma.aiPromptProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiPromptProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, AiPromptProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiPromptProfile.
     * @param {AiPromptProfileDeleteArgs} args - Arguments to delete one AiPromptProfile.
     * @example
     * // Delete one AiPromptProfile
     * const AiPromptProfile = await prisma.aiPromptProfile.delete({
     *   where: {
     *     // ... filter to delete one AiPromptProfile
     *   }
     * })
     * 
     */
    delete<T extends AiPromptProfileDeleteArgs>(args: SelectSubset<T, AiPromptProfileDeleteArgs<ExtArgs>>): Prisma__AiPromptProfileClient<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiPromptProfile.
     * @param {AiPromptProfileUpdateArgs} args - Arguments to update one AiPromptProfile.
     * @example
     * // Update one AiPromptProfile
     * const aiPromptProfile = await prisma.aiPromptProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiPromptProfileUpdateArgs>(args: SelectSubset<T, AiPromptProfileUpdateArgs<ExtArgs>>): Prisma__AiPromptProfileClient<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiPromptProfiles.
     * @param {AiPromptProfileDeleteManyArgs} args - Arguments to filter AiPromptProfiles to delete.
     * @example
     * // Delete a few AiPromptProfiles
     * const { count } = await prisma.aiPromptProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiPromptProfileDeleteManyArgs>(args?: SelectSubset<T, AiPromptProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiPromptProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiPromptProfiles
     * const aiPromptProfile = await prisma.aiPromptProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiPromptProfileUpdateManyArgs>(args: SelectSubset<T, AiPromptProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiPromptProfiles and returns the data updated in the database.
     * @param {AiPromptProfileUpdateManyAndReturnArgs} args - Arguments to update many AiPromptProfiles.
     * @example
     * // Update many AiPromptProfiles
     * const aiPromptProfile = await prisma.aiPromptProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiPromptProfiles and only return the `id`
     * const aiPromptProfileWithIdOnly = await prisma.aiPromptProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiPromptProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, AiPromptProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiPromptProfile.
     * @param {AiPromptProfileUpsertArgs} args - Arguments to update or create a AiPromptProfile.
     * @example
     * // Update or create a AiPromptProfile
     * const aiPromptProfile = await prisma.aiPromptProfile.upsert({
     *   create: {
     *     // ... data to create a AiPromptProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiPromptProfile we want to update
     *   }
     * })
     */
    upsert<T extends AiPromptProfileUpsertArgs>(args: SelectSubset<T, AiPromptProfileUpsertArgs<ExtArgs>>): Prisma__AiPromptProfileClient<$Result.GetResult<Prisma.$AiPromptProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiPromptProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptProfileCountArgs} args - Arguments to filter AiPromptProfiles to count.
     * @example
     * // Count the number of AiPromptProfiles
     * const count = await prisma.aiPromptProfile.count({
     *   where: {
     *     // ... the filter for the AiPromptProfiles we want to count
     *   }
     * })
    **/
    count<T extends AiPromptProfileCountArgs>(
      args?: Subset<T, AiPromptProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiPromptProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiPromptProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiPromptProfileAggregateArgs>(args: Subset<T, AiPromptProfileAggregateArgs>): Prisma.PrismaPromise<GetAiPromptProfileAggregateType<T>>

    /**
     * Group by AiPromptProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPromptProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiPromptProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiPromptProfileGroupByArgs['orderBy'] }
        : { orderBy?: AiPromptProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiPromptProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiPromptProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiPromptProfile model
   */
  readonly fields: AiPromptProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiPromptProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiPromptProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiPromptProfile model
   */
  interface AiPromptProfileFieldRefs {
    readonly id: FieldRef<"AiPromptProfile", 'String'>
    readonly userId: FieldRef<"AiPromptProfile", 'String'>
    readonly cvRules: FieldRef<"AiPromptProfile", 'Json'>
    readonly coverRules: FieldRef<"AiPromptProfile", 'Json'>
    readonly createdAt: FieldRef<"AiPromptProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"AiPromptProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiPromptProfile findUnique
   */
  export type AiPromptProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptProfile to fetch.
     */
    where: AiPromptProfileWhereUniqueInput
  }

  /**
   * AiPromptProfile findUniqueOrThrow
   */
  export type AiPromptProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptProfile to fetch.
     */
    where: AiPromptProfileWhereUniqueInput
  }

  /**
   * AiPromptProfile findFirst
   */
  export type AiPromptProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptProfile to fetch.
     */
    where?: AiPromptProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPromptProfiles to fetch.
     */
    orderBy?: AiPromptProfileOrderByWithRelationInput | AiPromptProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiPromptProfiles.
     */
    cursor?: AiPromptProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPromptProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPromptProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiPromptProfiles.
     */
    distinct?: AiPromptProfileScalarFieldEnum | AiPromptProfileScalarFieldEnum[]
  }

  /**
   * AiPromptProfile findFirstOrThrow
   */
  export type AiPromptProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptProfile to fetch.
     */
    where?: AiPromptProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPromptProfiles to fetch.
     */
    orderBy?: AiPromptProfileOrderByWithRelationInput | AiPromptProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiPromptProfiles.
     */
    cursor?: AiPromptProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPromptProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPromptProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiPromptProfiles.
     */
    distinct?: AiPromptProfileScalarFieldEnum | AiPromptProfileScalarFieldEnum[]
  }

  /**
   * AiPromptProfile findMany
   */
  export type AiPromptProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    /**
     * Filter, which AiPromptProfiles to fetch.
     */
    where?: AiPromptProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPromptProfiles to fetch.
     */
    orderBy?: AiPromptProfileOrderByWithRelationInput | AiPromptProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiPromptProfiles.
     */
    cursor?: AiPromptProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPromptProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPromptProfiles.
     */
    skip?: number
    distinct?: AiPromptProfileScalarFieldEnum | AiPromptProfileScalarFieldEnum[]
  }

  /**
   * AiPromptProfile create
   */
  export type AiPromptProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a AiPromptProfile.
     */
    data: XOR<AiPromptProfileCreateInput, AiPromptProfileUncheckedCreateInput>
  }

  /**
   * AiPromptProfile createMany
   */
  export type AiPromptProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiPromptProfiles.
     */
    data: AiPromptProfileCreateManyInput | AiPromptProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiPromptProfile createManyAndReturn
   */
  export type AiPromptProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * The data used to create many AiPromptProfiles.
     */
    data: AiPromptProfileCreateManyInput | AiPromptProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiPromptProfile update
   */
  export type AiPromptProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a AiPromptProfile.
     */
    data: XOR<AiPromptProfileUpdateInput, AiPromptProfileUncheckedUpdateInput>
    /**
     * Choose, which AiPromptProfile to update.
     */
    where: AiPromptProfileWhereUniqueInput
  }

  /**
   * AiPromptProfile updateMany
   */
  export type AiPromptProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiPromptProfiles.
     */
    data: XOR<AiPromptProfileUpdateManyMutationInput, AiPromptProfileUncheckedUpdateManyInput>
    /**
     * Filter which AiPromptProfiles to update
     */
    where?: AiPromptProfileWhereInput
    /**
     * Limit how many AiPromptProfiles to update.
     */
    limit?: number
  }

  /**
   * AiPromptProfile updateManyAndReturn
   */
  export type AiPromptProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * The data used to update AiPromptProfiles.
     */
    data: XOR<AiPromptProfileUpdateManyMutationInput, AiPromptProfileUncheckedUpdateManyInput>
    /**
     * Filter which AiPromptProfiles to update
     */
    where?: AiPromptProfileWhereInput
    /**
     * Limit how many AiPromptProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiPromptProfile upsert
   */
  export type AiPromptProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the AiPromptProfile to update in case it exists.
     */
    where: AiPromptProfileWhereUniqueInput
    /**
     * In case the AiPromptProfile found by the `where` argument doesn't exist, create a new AiPromptProfile with this data.
     */
    create: XOR<AiPromptProfileCreateInput, AiPromptProfileUncheckedCreateInput>
    /**
     * In case the AiPromptProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiPromptProfileUpdateInput, AiPromptProfileUncheckedUpdateInput>
  }

  /**
   * AiPromptProfile delete
   */
  export type AiPromptProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
    /**
     * Filter which AiPromptProfile to delete.
     */
    where: AiPromptProfileWhereUniqueInput
  }

  /**
   * AiPromptProfile deleteMany
   */
  export type AiPromptProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiPromptProfiles to delete
     */
    where?: AiPromptProfileWhereInput
    /**
     * Limit how many AiPromptProfiles to delete.
     */
    limit?: number
  }

  /**
   * AiPromptProfile without action
   */
  export type AiPromptProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPromptProfile
     */
    select?: AiPromptProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPromptProfile
     */
    omit?: AiPromptProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiPromptProfileInclude<ExtArgs> | null
  }


  /**
   * Model UserAiProviderConfig
   */

  export type AggregateUserAiProviderConfig = {
    _count: UserAiProviderConfigCountAggregateOutputType | null
    _min: UserAiProviderConfigMinAggregateOutputType | null
    _max: UserAiProviderConfigMaxAggregateOutputType | null
  }

  export type UserAiProviderConfigMinAggregateOutputType = {
    id: string | null
    userId: string | null
    provider: $Enums.AiProvider | null
    model: string | null
    apiKeyCiphertext: string | null
    apiKeyIv: string | null
    apiKeyTag: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserAiProviderConfigMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    provider: $Enums.AiProvider | null
    model: string | null
    apiKeyCiphertext: string | null
    apiKeyIv: string | null
    apiKeyTag: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserAiProviderConfigCountAggregateOutputType = {
    id: number
    userId: number
    provider: number
    model: number
    apiKeyCiphertext: number
    apiKeyIv: number
    apiKeyTag: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAiProviderConfigMinAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    model?: true
    apiKeyCiphertext?: true
    apiKeyIv?: true
    apiKeyTag?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserAiProviderConfigMaxAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    model?: true
    apiKeyCiphertext?: true
    apiKeyIv?: true
    apiKeyTag?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserAiProviderConfigCountAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    model?: true
    apiKeyCiphertext?: true
    apiKeyIv?: true
    apiKeyTag?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAiProviderConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAiProviderConfig to aggregate.
     */
    where?: UserAiProviderConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAiProviderConfigs to fetch.
     */
    orderBy?: UserAiProviderConfigOrderByWithRelationInput | UserAiProviderConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAiProviderConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAiProviderConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAiProviderConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAiProviderConfigs
    **/
    _count?: true | UserAiProviderConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAiProviderConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAiProviderConfigMaxAggregateInputType
  }

  export type GetUserAiProviderConfigAggregateType<T extends UserAiProviderConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAiProviderConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAiProviderConfig[P]>
      : GetScalarType<T[P], AggregateUserAiProviderConfig[P]>
  }




  export type UserAiProviderConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAiProviderConfigWhereInput
    orderBy?: UserAiProviderConfigOrderByWithAggregationInput | UserAiProviderConfigOrderByWithAggregationInput[]
    by: UserAiProviderConfigScalarFieldEnum[] | UserAiProviderConfigScalarFieldEnum
    having?: UserAiProviderConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAiProviderConfigCountAggregateInputType | true
    _min?: UserAiProviderConfigMinAggregateInputType
    _max?: UserAiProviderConfigMaxAggregateInputType
  }

  export type UserAiProviderConfigGroupByOutputType = {
    id: string
    userId: string
    provider: $Enums.AiProvider
    model: string | null
    apiKeyCiphertext: string
    apiKeyIv: string
    apiKeyTag: string
    createdAt: Date
    updatedAt: Date
    _count: UserAiProviderConfigCountAggregateOutputType | null
    _min: UserAiProviderConfigMinAggregateOutputType | null
    _max: UserAiProviderConfigMaxAggregateOutputType | null
  }

  type GetUserAiProviderConfigGroupByPayload<T extends UserAiProviderConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAiProviderConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAiProviderConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAiProviderConfigGroupByOutputType[P]>
            : GetScalarType<T[P], UserAiProviderConfigGroupByOutputType[P]>
        }
      >
    >


  export type UserAiProviderConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    model?: boolean
    apiKeyCiphertext?: boolean
    apiKeyIv?: boolean
    apiKeyTag?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAiProviderConfig"]>

  export type UserAiProviderConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    model?: boolean
    apiKeyCiphertext?: boolean
    apiKeyIv?: boolean
    apiKeyTag?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAiProviderConfig"]>

  export type UserAiProviderConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    model?: boolean
    apiKeyCiphertext?: boolean
    apiKeyIv?: boolean
    apiKeyTag?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAiProviderConfig"]>

  export type UserAiProviderConfigSelectScalar = {
    id?: boolean
    userId?: boolean
    provider?: boolean
    model?: boolean
    apiKeyCiphertext?: boolean
    apiKeyIv?: boolean
    apiKeyTag?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserAiProviderConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "provider" | "model" | "apiKeyCiphertext" | "apiKeyIv" | "apiKeyTag" | "createdAt" | "updatedAt", ExtArgs["result"]["userAiProviderConfig"]>
  export type UserAiProviderConfigInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserAiProviderConfigIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserAiProviderConfigIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserAiProviderConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAiProviderConfig"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      provider: $Enums.AiProvider
      model: string | null
      apiKeyCiphertext: string
      apiKeyIv: string
      apiKeyTag: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userAiProviderConfig"]>
    composites: {}
  }

  type UserAiProviderConfigGetPayload<S extends boolean | null | undefined | UserAiProviderConfigDefaultArgs> = $Result.GetResult<Prisma.$UserAiProviderConfigPayload, S>

  type UserAiProviderConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserAiProviderConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserAiProviderConfigCountAggregateInputType | true
    }

  export interface UserAiProviderConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAiProviderConfig'], meta: { name: 'UserAiProviderConfig' } }
    /**
     * Find zero or one UserAiProviderConfig that matches the filter.
     * @param {UserAiProviderConfigFindUniqueArgs} args - Arguments to find a UserAiProviderConfig
     * @example
     * // Get one UserAiProviderConfig
     * const userAiProviderConfig = await prisma.userAiProviderConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAiProviderConfigFindUniqueArgs>(args: SelectSubset<T, UserAiProviderConfigFindUniqueArgs<ExtArgs>>): Prisma__UserAiProviderConfigClient<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserAiProviderConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserAiProviderConfigFindUniqueOrThrowArgs} args - Arguments to find a UserAiProviderConfig
     * @example
     * // Get one UserAiProviderConfig
     * const userAiProviderConfig = await prisma.userAiProviderConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAiProviderConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAiProviderConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAiProviderConfigClient<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAiProviderConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderConfigFindFirstArgs} args - Arguments to find a UserAiProviderConfig
     * @example
     * // Get one UserAiProviderConfig
     * const userAiProviderConfig = await prisma.userAiProviderConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAiProviderConfigFindFirstArgs>(args?: SelectSubset<T, UserAiProviderConfigFindFirstArgs<ExtArgs>>): Prisma__UserAiProviderConfigClient<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAiProviderConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderConfigFindFirstOrThrowArgs} args - Arguments to find a UserAiProviderConfig
     * @example
     * // Get one UserAiProviderConfig
     * const userAiProviderConfig = await prisma.userAiProviderConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAiProviderConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAiProviderConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAiProviderConfigClient<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserAiProviderConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAiProviderConfigs
     * const userAiProviderConfigs = await prisma.userAiProviderConfig.findMany()
     * 
     * // Get first 10 UserAiProviderConfigs
     * const userAiProviderConfigs = await prisma.userAiProviderConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userAiProviderConfigWithIdOnly = await prisma.userAiProviderConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserAiProviderConfigFindManyArgs>(args?: SelectSubset<T, UserAiProviderConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserAiProviderConfig.
     * @param {UserAiProviderConfigCreateArgs} args - Arguments to create a UserAiProviderConfig.
     * @example
     * // Create one UserAiProviderConfig
     * const UserAiProviderConfig = await prisma.userAiProviderConfig.create({
     *   data: {
     *     // ... data to create a UserAiProviderConfig
     *   }
     * })
     * 
     */
    create<T extends UserAiProviderConfigCreateArgs>(args: SelectSubset<T, UserAiProviderConfigCreateArgs<ExtArgs>>): Prisma__UserAiProviderConfigClient<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserAiProviderConfigs.
     * @param {UserAiProviderConfigCreateManyArgs} args - Arguments to create many UserAiProviderConfigs.
     * @example
     * // Create many UserAiProviderConfigs
     * const userAiProviderConfig = await prisma.userAiProviderConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAiProviderConfigCreateManyArgs>(args?: SelectSubset<T, UserAiProviderConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserAiProviderConfigs and returns the data saved in the database.
     * @param {UserAiProviderConfigCreateManyAndReturnArgs} args - Arguments to create many UserAiProviderConfigs.
     * @example
     * // Create many UserAiProviderConfigs
     * const userAiProviderConfig = await prisma.userAiProviderConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserAiProviderConfigs and only return the `id`
     * const userAiProviderConfigWithIdOnly = await prisma.userAiProviderConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserAiProviderConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, UserAiProviderConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserAiProviderConfig.
     * @param {UserAiProviderConfigDeleteArgs} args - Arguments to delete one UserAiProviderConfig.
     * @example
     * // Delete one UserAiProviderConfig
     * const UserAiProviderConfig = await prisma.userAiProviderConfig.delete({
     *   where: {
     *     // ... filter to delete one UserAiProviderConfig
     *   }
     * })
     * 
     */
    delete<T extends UserAiProviderConfigDeleteArgs>(args: SelectSubset<T, UserAiProviderConfigDeleteArgs<ExtArgs>>): Prisma__UserAiProviderConfigClient<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserAiProviderConfig.
     * @param {UserAiProviderConfigUpdateArgs} args - Arguments to update one UserAiProviderConfig.
     * @example
     * // Update one UserAiProviderConfig
     * const userAiProviderConfig = await prisma.userAiProviderConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAiProviderConfigUpdateArgs>(args: SelectSubset<T, UserAiProviderConfigUpdateArgs<ExtArgs>>): Prisma__UserAiProviderConfigClient<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserAiProviderConfigs.
     * @param {UserAiProviderConfigDeleteManyArgs} args - Arguments to filter UserAiProviderConfigs to delete.
     * @example
     * // Delete a few UserAiProviderConfigs
     * const { count } = await prisma.userAiProviderConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAiProviderConfigDeleteManyArgs>(args?: SelectSubset<T, UserAiProviderConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAiProviderConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAiProviderConfigs
     * const userAiProviderConfig = await prisma.userAiProviderConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAiProviderConfigUpdateManyArgs>(args: SelectSubset<T, UserAiProviderConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAiProviderConfigs and returns the data updated in the database.
     * @param {UserAiProviderConfigUpdateManyAndReturnArgs} args - Arguments to update many UserAiProviderConfigs.
     * @example
     * // Update many UserAiProviderConfigs
     * const userAiProviderConfig = await prisma.userAiProviderConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserAiProviderConfigs and only return the `id`
     * const userAiProviderConfigWithIdOnly = await prisma.userAiProviderConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserAiProviderConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, UserAiProviderConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserAiProviderConfig.
     * @param {UserAiProviderConfigUpsertArgs} args - Arguments to update or create a UserAiProviderConfig.
     * @example
     * // Update or create a UserAiProviderConfig
     * const userAiProviderConfig = await prisma.userAiProviderConfig.upsert({
     *   create: {
     *     // ... data to create a UserAiProviderConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAiProviderConfig we want to update
     *   }
     * })
     */
    upsert<T extends UserAiProviderConfigUpsertArgs>(args: SelectSubset<T, UserAiProviderConfigUpsertArgs<ExtArgs>>): Prisma__UserAiProviderConfigClient<$Result.GetResult<Prisma.$UserAiProviderConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserAiProviderConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderConfigCountArgs} args - Arguments to filter UserAiProviderConfigs to count.
     * @example
     * // Count the number of UserAiProviderConfigs
     * const count = await prisma.userAiProviderConfig.count({
     *   where: {
     *     // ... the filter for the UserAiProviderConfigs we want to count
     *   }
     * })
    **/
    count<T extends UserAiProviderConfigCountArgs>(
      args?: Subset<T, UserAiProviderConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAiProviderConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAiProviderConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAiProviderConfigAggregateArgs>(args: Subset<T, UserAiProviderConfigAggregateArgs>): Prisma.PrismaPromise<GetUserAiProviderConfigAggregateType<T>>

    /**
     * Group by UserAiProviderConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserAiProviderConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAiProviderConfigGroupByArgs['orderBy'] }
        : { orderBy?: UserAiProviderConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserAiProviderConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAiProviderConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAiProviderConfig model
   */
  readonly fields: UserAiProviderConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAiProviderConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAiProviderConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserAiProviderConfig model
   */
  interface UserAiProviderConfigFieldRefs {
    readonly id: FieldRef<"UserAiProviderConfig", 'String'>
    readonly userId: FieldRef<"UserAiProviderConfig", 'String'>
    readonly provider: FieldRef<"UserAiProviderConfig", 'AiProvider'>
    readonly model: FieldRef<"UserAiProviderConfig", 'String'>
    readonly apiKeyCiphertext: FieldRef<"UserAiProviderConfig", 'String'>
    readonly apiKeyIv: FieldRef<"UserAiProviderConfig", 'String'>
    readonly apiKeyTag: FieldRef<"UserAiProviderConfig", 'String'>
    readonly createdAt: FieldRef<"UserAiProviderConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"UserAiProviderConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserAiProviderConfig findUnique
   */
  export type UserAiProviderConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserAiProviderConfig to fetch.
     */
    where: UserAiProviderConfigWhereUniqueInput
  }

  /**
   * UserAiProviderConfig findUniqueOrThrow
   */
  export type UserAiProviderConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserAiProviderConfig to fetch.
     */
    where: UserAiProviderConfigWhereUniqueInput
  }

  /**
   * UserAiProviderConfig findFirst
   */
  export type UserAiProviderConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserAiProviderConfig to fetch.
     */
    where?: UserAiProviderConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAiProviderConfigs to fetch.
     */
    orderBy?: UserAiProviderConfigOrderByWithRelationInput | UserAiProviderConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAiProviderConfigs.
     */
    cursor?: UserAiProviderConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAiProviderConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAiProviderConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAiProviderConfigs.
     */
    distinct?: UserAiProviderConfigScalarFieldEnum | UserAiProviderConfigScalarFieldEnum[]
  }

  /**
   * UserAiProviderConfig findFirstOrThrow
   */
  export type UserAiProviderConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserAiProviderConfig to fetch.
     */
    where?: UserAiProviderConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAiProviderConfigs to fetch.
     */
    orderBy?: UserAiProviderConfigOrderByWithRelationInput | UserAiProviderConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAiProviderConfigs.
     */
    cursor?: UserAiProviderConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAiProviderConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAiProviderConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAiProviderConfigs.
     */
    distinct?: UserAiProviderConfigScalarFieldEnum | UserAiProviderConfigScalarFieldEnum[]
  }

  /**
   * UserAiProviderConfig findMany
   */
  export type UserAiProviderConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserAiProviderConfigs to fetch.
     */
    where?: UserAiProviderConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAiProviderConfigs to fetch.
     */
    orderBy?: UserAiProviderConfigOrderByWithRelationInput | UserAiProviderConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAiProviderConfigs.
     */
    cursor?: UserAiProviderConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAiProviderConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAiProviderConfigs.
     */
    skip?: number
    distinct?: UserAiProviderConfigScalarFieldEnum | UserAiProviderConfigScalarFieldEnum[]
  }

  /**
   * UserAiProviderConfig create
   */
  export type UserAiProviderConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    /**
     * The data needed to create a UserAiProviderConfig.
     */
    data: XOR<UserAiProviderConfigCreateInput, UserAiProviderConfigUncheckedCreateInput>
  }

  /**
   * UserAiProviderConfig createMany
   */
  export type UserAiProviderConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAiProviderConfigs.
     */
    data: UserAiProviderConfigCreateManyInput | UserAiProviderConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAiProviderConfig createManyAndReturn
   */
  export type UserAiProviderConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * The data used to create many UserAiProviderConfigs.
     */
    data: UserAiProviderConfigCreateManyInput | UserAiProviderConfigCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAiProviderConfig update
   */
  export type UserAiProviderConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    /**
     * The data needed to update a UserAiProviderConfig.
     */
    data: XOR<UserAiProviderConfigUpdateInput, UserAiProviderConfigUncheckedUpdateInput>
    /**
     * Choose, which UserAiProviderConfig to update.
     */
    where: UserAiProviderConfigWhereUniqueInput
  }

  /**
   * UserAiProviderConfig updateMany
   */
  export type UserAiProviderConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAiProviderConfigs.
     */
    data: XOR<UserAiProviderConfigUpdateManyMutationInput, UserAiProviderConfigUncheckedUpdateManyInput>
    /**
     * Filter which UserAiProviderConfigs to update
     */
    where?: UserAiProviderConfigWhereInput
    /**
     * Limit how many UserAiProviderConfigs to update.
     */
    limit?: number
  }

  /**
   * UserAiProviderConfig updateManyAndReturn
   */
  export type UserAiProviderConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * The data used to update UserAiProviderConfigs.
     */
    data: XOR<UserAiProviderConfigUpdateManyMutationInput, UserAiProviderConfigUncheckedUpdateManyInput>
    /**
     * Filter which UserAiProviderConfigs to update
     */
    where?: UserAiProviderConfigWhereInput
    /**
     * Limit how many UserAiProviderConfigs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAiProviderConfig upsert
   */
  export type UserAiProviderConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    /**
     * The filter to search for the UserAiProviderConfig to update in case it exists.
     */
    where: UserAiProviderConfigWhereUniqueInput
    /**
     * In case the UserAiProviderConfig found by the `where` argument doesn't exist, create a new UserAiProviderConfig with this data.
     */
    create: XOR<UserAiProviderConfigCreateInput, UserAiProviderConfigUncheckedCreateInput>
    /**
     * In case the UserAiProviderConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAiProviderConfigUpdateInput, UserAiProviderConfigUncheckedUpdateInput>
  }

  /**
   * UserAiProviderConfig delete
   */
  export type UserAiProviderConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
    /**
     * Filter which UserAiProviderConfig to delete.
     */
    where: UserAiProviderConfigWhereUniqueInput
  }

  /**
   * UserAiProviderConfig deleteMany
   */
  export type UserAiProviderConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAiProviderConfigs to delete
     */
    where?: UserAiProviderConfigWhereInput
    /**
     * Limit how many UserAiProviderConfigs to delete.
     */
    limit?: number
  }

  /**
   * UserAiProviderConfig without action
   */
  export type UserAiProviderConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAiProviderConfig
     */
    select?: UserAiProviderConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAiProviderConfig
     */
    omit?: UserAiProviderConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderConfigInclude<ExtArgs> | null
  }


  /**
   * Model Application
   */

  export type AggregateApplication = {
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  export type ApplicationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    jobId: string | null
    resumeProfileId: string | null
    company: string | null
    role: string | null
    resumeTexUrl: string | null
    resumePdfUrl: string | null
    coverTexUrl: string | null
    coverPdfUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ApplicationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    jobId: string | null
    resumeProfileId: string | null
    company: string | null
    role: string | null
    resumeTexUrl: string | null
    resumePdfUrl: string | null
    coverTexUrl: string | null
    coverPdfUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ApplicationCountAggregateOutputType = {
    id: number
    userId: number
    jobId: number
    resumeProfileId: number
    company: number
    role: number
    resumeTexUrl: number
    resumePdfUrl: number
    coverTexUrl: number
    coverPdfUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ApplicationMinAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    resumeProfileId?: true
    company?: true
    role?: true
    resumeTexUrl?: true
    resumePdfUrl?: true
    coverTexUrl?: true
    coverPdfUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ApplicationMaxAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    resumeProfileId?: true
    company?: true
    role?: true
    resumeTexUrl?: true
    resumePdfUrl?: true
    coverTexUrl?: true
    coverPdfUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ApplicationCountAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    resumeProfileId?: true
    company?: true
    role?: true
    resumeTexUrl?: true
    resumePdfUrl?: true
    coverTexUrl?: true
    coverPdfUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Application to aggregate.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Applications
    **/
    _count?: true | ApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplicationMaxAggregateInputType
  }

  export type GetApplicationAggregateType<T extends ApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplication[P]>
      : GetScalarType<T[P], AggregateApplication[P]>
  }




  export type ApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithAggregationInput | ApplicationOrderByWithAggregationInput[]
    by: ApplicationScalarFieldEnum[] | ApplicationScalarFieldEnum
    having?: ApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplicationCountAggregateInputType | true
    _min?: ApplicationMinAggregateInputType
    _max?: ApplicationMaxAggregateInputType
  }

  export type ApplicationGroupByOutputType = {
    id: string
    userId: string
    jobId: string | null
    resumeProfileId: string | null
    company: string | null
    role: string | null
    resumeTexUrl: string | null
    resumePdfUrl: string | null
    coverTexUrl: string | null
    coverPdfUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  type GetApplicationGroupByPayload<T extends ApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
        }
      >
    >


  export type ApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobId?: boolean
    resumeProfileId?: boolean
    company?: boolean
    role?: boolean
    resumeTexUrl?: boolean
    resumePdfUrl?: boolean
    coverTexUrl?: boolean
    coverPdfUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | Application$jobArgs<ExtArgs>
    resumeProfile?: boolean | Application$resumeProfileArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobId?: boolean
    resumeProfileId?: boolean
    company?: boolean
    role?: boolean
    resumeTexUrl?: boolean
    resumePdfUrl?: boolean
    coverTexUrl?: boolean
    coverPdfUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | Application$jobArgs<ExtArgs>
    resumeProfile?: boolean | Application$resumeProfileArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobId?: boolean
    resumeProfileId?: boolean
    company?: boolean
    role?: boolean
    resumeTexUrl?: boolean
    resumePdfUrl?: boolean
    coverTexUrl?: boolean
    coverPdfUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | Application$jobArgs<ExtArgs>
    resumeProfile?: boolean | Application$resumeProfileArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectScalar = {
    id?: boolean
    userId?: boolean
    jobId?: boolean
    resumeProfileId?: boolean
    company?: boolean
    role?: boolean
    resumeTexUrl?: boolean
    resumePdfUrl?: boolean
    coverTexUrl?: boolean
    coverPdfUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "jobId" | "resumeProfileId" | "company" | "role" | "resumeTexUrl" | "resumePdfUrl" | "coverTexUrl" | "coverPdfUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["application"]>
  export type ApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | Application$jobArgs<ExtArgs>
    resumeProfile?: boolean | Application$resumeProfileArgs<ExtArgs>
  }
  export type ApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | Application$jobArgs<ExtArgs>
    resumeProfile?: boolean | Application$resumeProfileArgs<ExtArgs>
  }
  export type ApplicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | Application$jobArgs<ExtArgs>
    resumeProfile?: boolean | Application$resumeProfileArgs<ExtArgs>
  }

  export type $ApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Application"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      job: Prisma.$JobPayload<ExtArgs> | null
      resumeProfile: Prisma.$ResumeProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      jobId: string | null
      resumeProfileId: string | null
      company: string | null
      role: string | null
      resumeTexUrl: string | null
      resumePdfUrl: string | null
      coverTexUrl: string | null
      coverPdfUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["application"]>
    composites: {}
  }

  type ApplicationGetPayload<S extends boolean | null | undefined | ApplicationDefaultArgs> = $Result.GetResult<Prisma.$ApplicationPayload, S>

  type ApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApplicationCountAggregateInputType | true
    }

  export interface ApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Application'], meta: { name: 'Application' } }
    /**
     * Find zero or one Application that matches the filter.
     * @param {ApplicationFindUniqueArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplicationFindUniqueArgs>(args: SelectSubset<T, ApplicationFindUniqueArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Application that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApplicationFindUniqueOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, ApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplicationFindFirstArgs>(args?: SelectSubset<T, ApplicationFindFirstArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, ApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Applications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Applications
     * const applications = await prisma.application.findMany()
     * 
     * // Get first 10 Applications
     * const applications = await prisma.application.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const applicationWithIdOnly = await prisma.application.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApplicationFindManyArgs>(args?: SelectSubset<T, ApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Application.
     * @param {ApplicationCreateArgs} args - Arguments to create a Application.
     * @example
     * // Create one Application
     * const Application = await prisma.application.create({
     *   data: {
     *     // ... data to create a Application
     *   }
     * })
     * 
     */
    create<T extends ApplicationCreateArgs>(args: SelectSubset<T, ApplicationCreateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Applications.
     * @param {ApplicationCreateManyArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApplicationCreateManyArgs>(args?: SelectSubset<T, ApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Applications and returns the data saved in the database.
     * @param {ApplicationCreateManyAndReturnArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, ApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Application.
     * @param {ApplicationDeleteArgs} args - Arguments to delete one Application.
     * @example
     * // Delete one Application
     * const Application = await prisma.application.delete({
     *   where: {
     *     // ... filter to delete one Application
     *   }
     * })
     * 
     */
    delete<T extends ApplicationDeleteArgs>(args: SelectSubset<T, ApplicationDeleteArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Application.
     * @param {ApplicationUpdateArgs} args - Arguments to update one Application.
     * @example
     * // Update one Application
     * const application = await prisma.application.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApplicationUpdateArgs>(args: SelectSubset<T, ApplicationUpdateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Applications.
     * @param {ApplicationDeleteManyArgs} args - Arguments to filter Applications to delete.
     * @example
     * // Delete a few Applications
     * const { count } = await prisma.application.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApplicationDeleteManyArgs>(args?: SelectSubset<T, ApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApplicationUpdateManyArgs>(args: SelectSubset<T, ApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications and returns the data updated in the database.
     * @param {ApplicationUpdateManyAndReturnArgs} args - Arguments to update many Applications.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, ApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Application.
     * @param {ApplicationUpsertArgs} args - Arguments to update or create a Application.
     * @example
     * // Update or create a Application
     * const application = await prisma.application.upsert({
     *   create: {
     *     // ... data to create a Application
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Application we want to update
     *   }
     * })
     */
    upsert<T extends ApplicationUpsertArgs>(args: SelectSubset<T, ApplicationUpsertArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationCountArgs} args - Arguments to filter Applications to count.
     * @example
     * // Count the number of Applications
     * const count = await prisma.application.count({
     *   where: {
     *     // ... the filter for the Applications we want to count
     *   }
     * })
    **/
    count<T extends ApplicationCountArgs>(
      args?: Subset<T, ApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApplicationAggregateArgs>(args: Subset<T, ApplicationAggregateArgs>): Prisma.PrismaPromise<GetApplicationAggregateType<T>>

    /**
     * Group by Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApplicationGroupByArgs['orderBy'] }
        : { orderBy?: ApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Application model
   */
  readonly fields: ApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Application.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    job<T extends Application$jobArgs<ExtArgs> = {}>(args?: Subset<T, Application$jobArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    resumeProfile<T extends Application$resumeProfileArgs<ExtArgs> = {}>(args?: Subset<T, Application$resumeProfileArgs<ExtArgs>>): Prisma__ResumeProfileClient<$Result.GetResult<Prisma.$ResumeProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Application model
   */
  interface ApplicationFieldRefs {
    readonly id: FieldRef<"Application", 'String'>
    readonly userId: FieldRef<"Application", 'String'>
    readonly jobId: FieldRef<"Application", 'String'>
    readonly resumeProfileId: FieldRef<"Application", 'String'>
    readonly company: FieldRef<"Application", 'String'>
    readonly role: FieldRef<"Application", 'String'>
    readonly resumeTexUrl: FieldRef<"Application", 'String'>
    readonly resumePdfUrl: FieldRef<"Application", 'String'>
    readonly coverTexUrl: FieldRef<"Application", 'String'>
    readonly coverPdfUrl: FieldRef<"Application", 'String'>
    readonly createdAt: FieldRef<"Application", 'DateTime'>
    readonly updatedAt: FieldRef<"Application", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Application findUnique
   */
  export type ApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findUniqueOrThrow
   */
  export type ApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findFirst
   */
  export type ApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findFirstOrThrow
   */
  export type ApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findMany
   */
  export type ApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Applications to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application create
   */
  export type ApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a Application.
     */
    data: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
  }

  /**
   * Application createMany
   */
  export type ApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Application createManyAndReturn
   */
  export type ApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Application update
   */
  export type ApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a Application.
     */
    data: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
    /**
     * Choose, which Application to update.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application updateMany
   */
  export type ApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
  }

  /**
   * Application updateManyAndReturn
   */
  export type ApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Application upsert
   */
  export type ApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the Application to update in case it exists.
     */
    where: ApplicationWhereUniqueInput
    /**
     * In case the Application found by the `where` argument doesn't exist, create a new Application with this data.
     */
    create: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
    /**
     * In case the Application was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
  }

  /**
   * Application delete
   */
  export type ApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter which Application to delete.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application deleteMany
   */
  export type ApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Applications to delete
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to delete.
     */
    limit?: number
  }

  /**
   * Application.job
   */
  export type Application$jobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    where?: JobWhereInput
  }

  /**
   * Application.resumeProfile
   */
  export type Application$resumeProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeProfile
     */
    select?: ResumeProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumeProfile
     */
    omit?: ResumeProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeProfileInclude<ExtArgs> | null
    where?: ResumeProfileWhereInput
  }

  /**
   * Application without action
   */
  export type ApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    image: 'image',
    emailVerified: 'emailVerified',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const JobScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobUrl: 'jobUrl',
    title: 'title',
    company: 'company',
    location: 'location',
    jobType: 'jobType',
    jobLevel: 'jobLevel',
    description: 'description',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JobScalarFieldEnum = (typeof JobScalarFieldEnum)[keyof typeof JobScalarFieldEnum]


  export const DeletedJobUrlScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobUrl: 'jobUrl',
    deletedAt: 'deletedAt'
  };

  export type DeletedJobUrlScalarFieldEnum = (typeof DeletedJobUrlScalarFieldEnum)[keyof typeof DeletedJobUrlScalarFieldEnum]


  export const DailyCheckinScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    localDate: 'localDate',
    checkedAt: 'checkedAt'
  };

  export type DailyCheckinScalarFieldEnum = (typeof DailyCheckinScalarFieldEnum)[keyof typeof DailyCheckinScalarFieldEnum]


  export const SavedSearchScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    query: 'query',
    location: 'location',
    hoursOld: 'hoursOld',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SavedSearchScalarFieldEnum = (typeof SavedSearchScalarFieldEnum)[keyof typeof SavedSearchScalarFieldEnum]


  export const FetchRunScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    userEmail: 'userEmail',
    status: 'status',
    error: 'error',
    importedCount: 'importedCount',
    queries: 'queries',
    location: 'location',
    hoursOld: 'hoursOld',
    resultsWanted: 'resultsWanted',
    includeFromQueries: 'includeFromQueries',
    filterDescription: 'filterDescription',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FetchRunScalarFieldEnum = (typeof FetchRunScalarFieldEnum)[keyof typeof FetchRunScalarFieldEnum]


  export const ResumeProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    summary: 'summary',
    basics: 'basics',
    links: 'links',
    skills: 'skills',
    experiences: 'experiences',
    projects: 'projects',
    education: 'education',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ResumeProfileScalarFieldEnum = (typeof ResumeProfileScalarFieldEnum)[keyof typeof ResumeProfileScalarFieldEnum]


  export const AiPromptProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    cvRules: 'cvRules',
    coverRules: 'coverRules',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiPromptProfileScalarFieldEnum = (typeof AiPromptProfileScalarFieldEnum)[keyof typeof AiPromptProfileScalarFieldEnum]


  export const UserAiProviderConfigScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    provider: 'provider',
    model: 'model',
    apiKeyCiphertext: 'apiKeyCiphertext',
    apiKeyIv: 'apiKeyIv',
    apiKeyTag: 'apiKeyTag',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserAiProviderConfigScalarFieldEnum = (typeof UserAiProviderConfigScalarFieldEnum)[keyof typeof UserAiProviderConfigScalarFieldEnum]


  export const ApplicationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobId: 'jobId',
    resumeProfileId: 'resumeProfileId',
    company: 'company',
    role: 'role',
    resumeTexUrl: 'resumeTexUrl',
    resumePdfUrl: 'resumePdfUrl',
    coverTexUrl: 'coverTexUrl',
    coverPdfUrl: 'coverPdfUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ApplicationScalarFieldEnum = (typeof ApplicationScalarFieldEnum)[keyof typeof ApplicationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'JobStatus'
   */
  export type EnumJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobStatus'>
    


  /**
   * Reference to a field of type 'JobStatus[]'
   */
  export type ListEnumJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobStatus[]'>
    


  /**
   * Reference to a field of type 'FetchRunStatus'
   */
  export type EnumFetchRunStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FetchRunStatus'>
    


  /**
   * Reference to a field of type 'FetchRunStatus[]'
   */
  export type ListEnumFetchRunStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FetchRunStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AiProvider'
   */
  export type EnumAiProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiProvider'>
    


  /**
   * Reference to a field of type 'AiProvider[]'
   */
  export type ListEnumAiProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiProvider[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    jobs?: JobListRelationFilter
    savedSearches?: SavedSearchListRelationFilter
    fetchRuns?: FetchRunListRelationFilter
    deletedJobUrls?: DeletedJobUrlListRelationFilter
    dailyCheckins?: DailyCheckinListRelationFilter
    resumeProfiles?: ResumeProfileListRelationFilter
    aiPromptProfile?: XOR<AiPromptProfileNullableScalarRelationFilter, AiPromptProfileWhereInput> | null
    aiProviderConfig?: XOR<UserAiProviderConfigNullableScalarRelationFilter, UserAiProviderConfigWhereInput> | null
    applications?: ApplicationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    jobs?: JobOrderByRelationAggregateInput
    savedSearches?: SavedSearchOrderByRelationAggregateInput
    fetchRuns?: FetchRunOrderByRelationAggregateInput
    deletedJobUrls?: DeletedJobUrlOrderByRelationAggregateInput
    dailyCheckins?: DailyCheckinOrderByRelationAggregateInput
    resumeProfiles?: ResumeProfileOrderByRelationAggregateInput
    aiPromptProfile?: AiPromptProfileOrderByWithRelationInput
    aiProviderConfig?: UserAiProviderConfigOrderByWithRelationInput
    applications?: ApplicationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    jobs?: JobListRelationFilter
    savedSearches?: SavedSearchListRelationFilter
    fetchRuns?: FetchRunListRelationFilter
    deletedJobUrls?: DeletedJobUrlListRelationFilter
    dailyCheckins?: DailyCheckinListRelationFilter
    resumeProfiles?: ResumeProfileListRelationFilter
    aiPromptProfile?: XOR<AiPromptProfileNullableScalarRelationFilter, AiPromptProfileWhereInput> | null
    aiProviderConfig?: XOR<UserAiProviderConfigNullableScalarRelationFilter, UserAiProviderConfigWhereInput> | null
    applications?: ApplicationListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: UuidFilter<"Account"> | string
    userId?: UuidFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: UuidFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Account"> | string
    userId?: UuidWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: UuidFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: UuidFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: UuidFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: UuidWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type JobWhereInput = {
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    id?: UuidFilter<"Job"> | string
    userId?: UuidFilter<"Job"> | string
    jobUrl?: StringFilter<"Job"> | string
    title?: StringFilter<"Job"> | string
    company?: StringNullableFilter<"Job"> | string | null
    location?: StringNullableFilter<"Job"> | string | null
    jobType?: StringNullableFilter<"Job"> | string | null
    jobLevel?: StringNullableFilter<"Job"> | string | null
    description?: StringNullableFilter<"Job"> | string | null
    status?: EnumJobStatusFilter<"Job"> | $Enums.JobStatus
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    applications?: ApplicationListRelationFilter
  }

  export type JobOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    title?: SortOrder
    company?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    jobType?: SortOrderInput | SortOrder
    jobLevel?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    applications?: ApplicationOrderByRelationAggregateInput
  }

  export type JobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_jobUrl?: JobUserIdJobUrlCompoundUniqueInput
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    userId?: UuidFilter<"Job"> | string
    jobUrl?: StringFilter<"Job"> | string
    title?: StringFilter<"Job"> | string
    company?: StringNullableFilter<"Job"> | string | null
    location?: StringNullableFilter<"Job"> | string | null
    jobType?: StringNullableFilter<"Job"> | string | null
    jobLevel?: StringNullableFilter<"Job"> | string | null
    description?: StringNullableFilter<"Job"> | string | null
    status?: EnumJobStatusFilter<"Job"> | $Enums.JobStatus
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    applications?: ApplicationListRelationFilter
  }, "id" | "userId_jobUrl">

  export type JobOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    title?: SortOrder
    company?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    jobType?: SortOrderInput | SortOrder
    jobLevel?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JobCountOrderByAggregateInput
    _max?: JobMaxOrderByAggregateInput
    _min?: JobMinOrderByAggregateInput
  }

  export type JobScalarWhereWithAggregatesInput = {
    AND?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    OR?: JobScalarWhereWithAggregatesInput[]
    NOT?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Job"> | string
    userId?: UuidWithAggregatesFilter<"Job"> | string
    jobUrl?: StringWithAggregatesFilter<"Job"> | string
    title?: StringWithAggregatesFilter<"Job"> | string
    company?: StringNullableWithAggregatesFilter<"Job"> | string | null
    location?: StringNullableWithAggregatesFilter<"Job"> | string | null
    jobType?: StringNullableWithAggregatesFilter<"Job"> | string | null
    jobLevel?: StringNullableWithAggregatesFilter<"Job"> | string | null
    description?: StringNullableWithAggregatesFilter<"Job"> | string | null
    status?: EnumJobStatusWithAggregatesFilter<"Job"> | $Enums.JobStatus
    createdAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
  }

  export type DeletedJobUrlWhereInput = {
    AND?: DeletedJobUrlWhereInput | DeletedJobUrlWhereInput[]
    OR?: DeletedJobUrlWhereInput[]
    NOT?: DeletedJobUrlWhereInput | DeletedJobUrlWhereInput[]
    id?: UuidFilter<"DeletedJobUrl"> | string
    userId?: UuidFilter<"DeletedJobUrl"> | string
    jobUrl?: StringFilter<"DeletedJobUrl"> | string
    deletedAt?: DateTimeFilter<"DeletedJobUrl"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DeletedJobUrlOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    deletedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type DeletedJobUrlWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_jobUrl?: DeletedJobUrlUserIdJobUrlCompoundUniqueInput
    AND?: DeletedJobUrlWhereInput | DeletedJobUrlWhereInput[]
    OR?: DeletedJobUrlWhereInput[]
    NOT?: DeletedJobUrlWhereInput | DeletedJobUrlWhereInput[]
    userId?: UuidFilter<"DeletedJobUrl"> | string
    jobUrl?: StringFilter<"DeletedJobUrl"> | string
    deletedAt?: DateTimeFilter<"DeletedJobUrl"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_jobUrl">

  export type DeletedJobUrlOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    deletedAt?: SortOrder
    _count?: DeletedJobUrlCountOrderByAggregateInput
    _max?: DeletedJobUrlMaxOrderByAggregateInput
    _min?: DeletedJobUrlMinOrderByAggregateInput
  }

  export type DeletedJobUrlScalarWhereWithAggregatesInput = {
    AND?: DeletedJobUrlScalarWhereWithAggregatesInput | DeletedJobUrlScalarWhereWithAggregatesInput[]
    OR?: DeletedJobUrlScalarWhereWithAggregatesInput[]
    NOT?: DeletedJobUrlScalarWhereWithAggregatesInput | DeletedJobUrlScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"DeletedJobUrl"> | string
    userId?: UuidWithAggregatesFilter<"DeletedJobUrl"> | string
    jobUrl?: StringWithAggregatesFilter<"DeletedJobUrl"> | string
    deletedAt?: DateTimeWithAggregatesFilter<"DeletedJobUrl"> | Date | string
  }

  export type DailyCheckinWhereInput = {
    AND?: DailyCheckinWhereInput | DailyCheckinWhereInput[]
    OR?: DailyCheckinWhereInput[]
    NOT?: DailyCheckinWhereInput | DailyCheckinWhereInput[]
    id?: UuidFilter<"DailyCheckin"> | string
    userId?: UuidFilter<"DailyCheckin"> | string
    localDate?: StringFilter<"DailyCheckin"> | string
    checkedAt?: DateTimeFilter<"DailyCheckin"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DailyCheckinOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    localDate?: SortOrder
    checkedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type DailyCheckinWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_localDate?: DailyCheckinUserIdLocalDateCompoundUniqueInput
    AND?: DailyCheckinWhereInput | DailyCheckinWhereInput[]
    OR?: DailyCheckinWhereInput[]
    NOT?: DailyCheckinWhereInput | DailyCheckinWhereInput[]
    userId?: UuidFilter<"DailyCheckin"> | string
    localDate?: StringFilter<"DailyCheckin"> | string
    checkedAt?: DateTimeFilter<"DailyCheckin"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_localDate">

  export type DailyCheckinOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    localDate?: SortOrder
    checkedAt?: SortOrder
    _count?: DailyCheckinCountOrderByAggregateInput
    _max?: DailyCheckinMaxOrderByAggregateInput
    _min?: DailyCheckinMinOrderByAggregateInput
  }

  export type DailyCheckinScalarWhereWithAggregatesInput = {
    AND?: DailyCheckinScalarWhereWithAggregatesInput | DailyCheckinScalarWhereWithAggregatesInput[]
    OR?: DailyCheckinScalarWhereWithAggregatesInput[]
    NOT?: DailyCheckinScalarWhereWithAggregatesInput | DailyCheckinScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"DailyCheckin"> | string
    userId?: UuidWithAggregatesFilter<"DailyCheckin"> | string
    localDate?: StringWithAggregatesFilter<"DailyCheckin"> | string
    checkedAt?: DateTimeWithAggregatesFilter<"DailyCheckin"> | Date | string
  }

  export type SavedSearchWhereInput = {
    AND?: SavedSearchWhereInput | SavedSearchWhereInput[]
    OR?: SavedSearchWhereInput[]
    NOT?: SavedSearchWhereInput | SavedSearchWhereInput[]
    id?: UuidFilter<"SavedSearch"> | string
    userId?: UuidFilter<"SavedSearch"> | string
    name?: StringFilter<"SavedSearch"> | string
    query?: StringFilter<"SavedSearch"> | string
    location?: StringNullableFilter<"SavedSearch"> | string | null
    hoursOld?: IntNullableFilter<"SavedSearch"> | number | null
    createdAt?: DateTimeFilter<"SavedSearch"> | Date | string
    updatedAt?: DateTimeFilter<"SavedSearch"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SavedSearchOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    query?: SortOrder
    location?: SortOrderInput | SortOrder
    hoursOld?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SavedSearchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SavedSearchWhereInput | SavedSearchWhereInput[]
    OR?: SavedSearchWhereInput[]
    NOT?: SavedSearchWhereInput | SavedSearchWhereInput[]
    userId?: UuidFilter<"SavedSearch"> | string
    name?: StringFilter<"SavedSearch"> | string
    query?: StringFilter<"SavedSearch"> | string
    location?: StringNullableFilter<"SavedSearch"> | string | null
    hoursOld?: IntNullableFilter<"SavedSearch"> | number | null
    createdAt?: DateTimeFilter<"SavedSearch"> | Date | string
    updatedAt?: DateTimeFilter<"SavedSearch"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SavedSearchOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    query?: SortOrder
    location?: SortOrderInput | SortOrder
    hoursOld?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SavedSearchCountOrderByAggregateInput
    _avg?: SavedSearchAvgOrderByAggregateInput
    _max?: SavedSearchMaxOrderByAggregateInput
    _min?: SavedSearchMinOrderByAggregateInput
    _sum?: SavedSearchSumOrderByAggregateInput
  }

  export type SavedSearchScalarWhereWithAggregatesInput = {
    AND?: SavedSearchScalarWhereWithAggregatesInput | SavedSearchScalarWhereWithAggregatesInput[]
    OR?: SavedSearchScalarWhereWithAggregatesInput[]
    NOT?: SavedSearchScalarWhereWithAggregatesInput | SavedSearchScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SavedSearch"> | string
    userId?: UuidWithAggregatesFilter<"SavedSearch"> | string
    name?: StringWithAggregatesFilter<"SavedSearch"> | string
    query?: StringWithAggregatesFilter<"SavedSearch"> | string
    location?: StringNullableWithAggregatesFilter<"SavedSearch"> | string | null
    hoursOld?: IntNullableWithAggregatesFilter<"SavedSearch"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"SavedSearch"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SavedSearch"> | Date | string
  }

  export type FetchRunWhereInput = {
    AND?: FetchRunWhereInput | FetchRunWhereInput[]
    OR?: FetchRunWhereInput[]
    NOT?: FetchRunWhereInput | FetchRunWhereInput[]
    id?: UuidFilter<"FetchRun"> | string
    userId?: UuidFilter<"FetchRun"> | string
    userEmail?: StringFilter<"FetchRun"> | string
    status?: EnumFetchRunStatusFilter<"FetchRun"> | $Enums.FetchRunStatus
    error?: StringNullableFilter<"FetchRun"> | string | null
    importedCount?: IntFilter<"FetchRun"> | number
    queries?: JsonFilter<"FetchRun">
    location?: StringNullableFilter<"FetchRun"> | string | null
    hoursOld?: IntNullableFilter<"FetchRun"> | number | null
    resultsWanted?: IntNullableFilter<"FetchRun"> | number | null
    includeFromQueries?: BoolFilter<"FetchRun"> | boolean
    filterDescription?: BoolFilter<"FetchRun"> | boolean
    createdAt?: DateTimeFilter<"FetchRun"> | Date | string
    updatedAt?: DateTimeFilter<"FetchRun"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FetchRunOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    importedCount?: SortOrder
    queries?: SortOrder
    location?: SortOrderInput | SortOrder
    hoursOld?: SortOrderInput | SortOrder
    resultsWanted?: SortOrderInput | SortOrder
    includeFromQueries?: SortOrder
    filterDescription?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type FetchRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FetchRunWhereInput | FetchRunWhereInput[]
    OR?: FetchRunWhereInput[]
    NOT?: FetchRunWhereInput | FetchRunWhereInput[]
    userId?: UuidFilter<"FetchRun"> | string
    userEmail?: StringFilter<"FetchRun"> | string
    status?: EnumFetchRunStatusFilter<"FetchRun"> | $Enums.FetchRunStatus
    error?: StringNullableFilter<"FetchRun"> | string | null
    importedCount?: IntFilter<"FetchRun"> | number
    queries?: JsonFilter<"FetchRun">
    location?: StringNullableFilter<"FetchRun"> | string | null
    hoursOld?: IntNullableFilter<"FetchRun"> | number | null
    resultsWanted?: IntNullableFilter<"FetchRun"> | number | null
    includeFromQueries?: BoolFilter<"FetchRun"> | boolean
    filterDescription?: BoolFilter<"FetchRun"> | boolean
    createdAt?: DateTimeFilter<"FetchRun"> | Date | string
    updatedAt?: DateTimeFilter<"FetchRun"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type FetchRunOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    importedCount?: SortOrder
    queries?: SortOrder
    location?: SortOrderInput | SortOrder
    hoursOld?: SortOrderInput | SortOrder
    resultsWanted?: SortOrderInput | SortOrder
    includeFromQueries?: SortOrder
    filterDescription?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FetchRunCountOrderByAggregateInput
    _avg?: FetchRunAvgOrderByAggregateInput
    _max?: FetchRunMaxOrderByAggregateInput
    _min?: FetchRunMinOrderByAggregateInput
    _sum?: FetchRunSumOrderByAggregateInput
  }

  export type FetchRunScalarWhereWithAggregatesInput = {
    AND?: FetchRunScalarWhereWithAggregatesInput | FetchRunScalarWhereWithAggregatesInput[]
    OR?: FetchRunScalarWhereWithAggregatesInput[]
    NOT?: FetchRunScalarWhereWithAggregatesInput | FetchRunScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"FetchRun"> | string
    userId?: UuidWithAggregatesFilter<"FetchRun"> | string
    userEmail?: StringWithAggregatesFilter<"FetchRun"> | string
    status?: EnumFetchRunStatusWithAggregatesFilter<"FetchRun"> | $Enums.FetchRunStatus
    error?: StringNullableWithAggregatesFilter<"FetchRun"> | string | null
    importedCount?: IntWithAggregatesFilter<"FetchRun"> | number
    queries?: JsonWithAggregatesFilter<"FetchRun">
    location?: StringNullableWithAggregatesFilter<"FetchRun"> | string | null
    hoursOld?: IntNullableWithAggregatesFilter<"FetchRun"> | number | null
    resultsWanted?: IntNullableWithAggregatesFilter<"FetchRun"> | number | null
    includeFromQueries?: BoolWithAggregatesFilter<"FetchRun"> | boolean
    filterDescription?: BoolWithAggregatesFilter<"FetchRun"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"FetchRun"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FetchRun"> | Date | string
  }

  export type ResumeProfileWhereInput = {
    AND?: ResumeProfileWhereInput | ResumeProfileWhereInput[]
    OR?: ResumeProfileWhereInput[]
    NOT?: ResumeProfileWhereInput | ResumeProfileWhereInput[]
    id?: UuidFilter<"ResumeProfile"> | string
    userId?: UuidFilter<"ResumeProfile"> | string
    summary?: StringNullableFilter<"ResumeProfile"> | string | null
    basics?: JsonNullableFilter<"ResumeProfile">
    links?: JsonNullableFilter<"ResumeProfile">
    skills?: JsonNullableFilter<"ResumeProfile">
    experiences?: JsonNullableFilter<"ResumeProfile">
    projects?: JsonNullableFilter<"ResumeProfile">
    education?: JsonNullableFilter<"ResumeProfile">
    createdAt?: DateTimeFilter<"ResumeProfile"> | Date | string
    updatedAt?: DateTimeFilter<"ResumeProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    applications?: ApplicationListRelationFilter
  }

  export type ResumeProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    summary?: SortOrderInput | SortOrder
    basics?: SortOrderInput | SortOrder
    links?: SortOrderInput | SortOrder
    skills?: SortOrderInput | SortOrder
    experiences?: SortOrderInput | SortOrder
    projects?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    applications?: ApplicationOrderByRelationAggregateInput
  }

  export type ResumeProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResumeProfileWhereInput | ResumeProfileWhereInput[]
    OR?: ResumeProfileWhereInput[]
    NOT?: ResumeProfileWhereInput | ResumeProfileWhereInput[]
    userId?: UuidFilter<"ResumeProfile"> | string
    summary?: StringNullableFilter<"ResumeProfile"> | string | null
    basics?: JsonNullableFilter<"ResumeProfile">
    links?: JsonNullableFilter<"ResumeProfile">
    skills?: JsonNullableFilter<"ResumeProfile">
    experiences?: JsonNullableFilter<"ResumeProfile">
    projects?: JsonNullableFilter<"ResumeProfile">
    education?: JsonNullableFilter<"ResumeProfile">
    createdAt?: DateTimeFilter<"ResumeProfile"> | Date | string
    updatedAt?: DateTimeFilter<"ResumeProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    applications?: ApplicationListRelationFilter
  }, "id">

  export type ResumeProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    summary?: SortOrderInput | SortOrder
    basics?: SortOrderInput | SortOrder
    links?: SortOrderInput | SortOrder
    skills?: SortOrderInput | SortOrder
    experiences?: SortOrderInput | SortOrder
    projects?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ResumeProfileCountOrderByAggregateInput
    _max?: ResumeProfileMaxOrderByAggregateInput
    _min?: ResumeProfileMinOrderByAggregateInput
  }

  export type ResumeProfileScalarWhereWithAggregatesInput = {
    AND?: ResumeProfileScalarWhereWithAggregatesInput | ResumeProfileScalarWhereWithAggregatesInput[]
    OR?: ResumeProfileScalarWhereWithAggregatesInput[]
    NOT?: ResumeProfileScalarWhereWithAggregatesInput | ResumeProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ResumeProfile"> | string
    userId?: UuidWithAggregatesFilter<"ResumeProfile"> | string
    summary?: StringNullableWithAggregatesFilter<"ResumeProfile"> | string | null
    basics?: JsonNullableWithAggregatesFilter<"ResumeProfile">
    links?: JsonNullableWithAggregatesFilter<"ResumeProfile">
    skills?: JsonNullableWithAggregatesFilter<"ResumeProfile">
    experiences?: JsonNullableWithAggregatesFilter<"ResumeProfile">
    projects?: JsonNullableWithAggregatesFilter<"ResumeProfile">
    education?: JsonNullableWithAggregatesFilter<"ResumeProfile">
    createdAt?: DateTimeWithAggregatesFilter<"ResumeProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ResumeProfile"> | Date | string
  }

  export type AiPromptProfileWhereInput = {
    AND?: AiPromptProfileWhereInput | AiPromptProfileWhereInput[]
    OR?: AiPromptProfileWhereInput[]
    NOT?: AiPromptProfileWhereInput | AiPromptProfileWhereInput[]
    id?: UuidFilter<"AiPromptProfile"> | string
    userId?: UuidFilter<"AiPromptProfile"> | string
    cvRules?: JsonFilter<"AiPromptProfile">
    coverRules?: JsonFilter<"AiPromptProfile">
    createdAt?: DateTimeFilter<"AiPromptProfile"> | Date | string
    updatedAt?: DateTimeFilter<"AiPromptProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AiPromptProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    cvRules?: SortOrder
    coverRules?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AiPromptProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: AiPromptProfileWhereInput | AiPromptProfileWhereInput[]
    OR?: AiPromptProfileWhereInput[]
    NOT?: AiPromptProfileWhereInput | AiPromptProfileWhereInput[]
    cvRules?: JsonFilter<"AiPromptProfile">
    coverRules?: JsonFilter<"AiPromptProfile">
    createdAt?: DateTimeFilter<"AiPromptProfile"> | Date | string
    updatedAt?: DateTimeFilter<"AiPromptProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type AiPromptProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    cvRules?: SortOrder
    coverRules?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiPromptProfileCountOrderByAggregateInput
    _max?: AiPromptProfileMaxOrderByAggregateInput
    _min?: AiPromptProfileMinOrderByAggregateInput
  }

  export type AiPromptProfileScalarWhereWithAggregatesInput = {
    AND?: AiPromptProfileScalarWhereWithAggregatesInput | AiPromptProfileScalarWhereWithAggregatesInput[]
    OR?: AiPromptProfileScalarWhereWithAggregatesInput[]
    NOT?: AiPromptProfileScalarWhereWithAggregatesInput | AiPromptProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AiPromptProfile"> | string
    userId?: UuidWithAggregatesFilter<"AiPromptProfile"> | string
    cvRules?: JsonWithAggregatesFilter<"AiPromptProfile">
    coverRules?: JsonWithAggregatesFilter<"AiPromptProfile">
    createdAt?: DateTimeWithAggregatesFilter<"AiPromptProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiPromptProfile"> | Date | string
  }

  export type UserAiProviderConfigWhereInput = {
    AND?: UserAiProviderConfigWhereInput | UserAiProviderConfigWhereInput[]
    OR?: UserAiProviderConfigWhereInput[]
    NOT?: UserAiProviderConfigWhereInput | UserAiProviderConfigWhereInput[]
    id?: UuidFilter<"UserAiProviderConfig"> | string
    userId?: UuidFilter<"UserAiProviderConfig"> | string
    provider?: EnumAiProviderFilter<"UserAiProviderConfig"> | $Enums.AiProvider
    model?: StringNullableFilter<"UserAiProviderConfig"> | string | null
    apiKeyCiphertext?: StringFilter<"UserAiProviderConfig"> | string
    apiKeyIv?: StringFilter<"UserAiProviderConfig"> | string
    apiKeyTag?: StringFilter<"UserAiProviderConfig"> | string
    createdAt?: DateTimeFilter<"UserAiProviderConfig"> | Date | string
    updatedAt?: DateTimeFilter<"UserAiProviderConfig"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserAiProviderConfigOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    model?: SortOrderInput | SortOrder
    apiKeyCiphertext?: SortOrder
    apiKeyIv?: SortOrder
    apiKeyTag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserAiProviderConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserAiProviderConfigWhereInput | UserAiProviderConfigWhereInput[]
    OR?: UserAiProviderConfigWhereInput[]
    NOT?: UserAiProviderConfigWhereInput | UserAiProviderConfigWhereInput[]
    provider?: EnumAiProviderFilter<"UserAiProviderConfig"> | $Enums.AiProvider
    model?: StringNullableFilter<"UserAiProviderConfig"> | string | null
    apiKeyCiphertext?: StringFilter<"UserAiProviderConfig"> | string
    apiKeyIv?: StringFilter<"UserAiProviderConfig"> | string
    apiKeyTag?: StringFilter<"UserAiProviderConfig"> | string
    createdAt?: DateTimeFilter<"UserAiProviderConfig"> | Date | string
    updatedAt?: DateTimeFilter<"UserAiProviderConfig"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserAiProviderConfigOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    model?: SortOrderInput | SortOrder
    apiKeyCiphertext?: SortOrder
    apiKeyIv?: SortOrder
    apiKeyTag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserAiProviderConfigCountOrderByAggregateInput
    _max?: UserAiProviderConfigMaxOrderByAggregateInput
    _min?: UserAiProviderConfigMinOrderByAggregateInput
  }

  export type UserAiProviderConfigScalarWhereWithAggregatesInput = {
    AND?: UserAiProviderConfigScalarWhereWithAggregatesInput | UserAiProviderConfigScalarWhereWithAggregatesInput[]
    OR?: UserAiProviderConfigScalarWhereWithAggregatesInput[]
    NOT?: UserAiProviderConfigScalarWhereWithAggregatesInput | UserAiProviderConfigScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserAiProviderConfig"> | string
    userId?: UuidWithAggregatesFilter<"UserAiProviderConfig"> | string
    provider?: EnumAiProviderWithAggregatesFilter<"UserAiProviderConfig"> | $Enums.AiProvider
    model?: StringNullableWithAggregatesFilter<"UserAiProviderConfig"> | string | null
    apiKeyCiphertext?: StringWithAggregatesFilter<"UserAiProviderConfig"> | string
    apiKeyIv?: StringWithAggregatesFilter<"UserAiProviderConfig"> | string
    apiKeyTag?: StringWithAggregatesFilter<"UserAiProviderConfig"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UserAiProviderConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserAiProviderConfig"> | Date | string
  }

  export type ApplicationWhereInput = {
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    id?: UuidFilter<"Application"> | string
    userId?: UuidFilter<"Application"> | string
    jobId?: UuidNullableFilter<"Application"> | string | null
    resumeProfileId?: UuidNullableFilter<"Application"> | string | null
    company?: StringNullableFilter<"Application"> | string | null
    role?: StringNullableFilter<"Application"> | string | null
    resumeTexUrl?: StringNullableFilter<"Application"> | string | null
    resumePdfUrl?: StringNullableFilter<"Application"> | string | null
    coverTexUrl?: StringNullableFilter<"Application"> | string | null
    coverPdfUrl?: StringNullableFilter<"Application"> | string | null
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    job?: XOR<JobNullableScalarRelationFilter, JobWhereInput> | null
    resumeProfile?: XOR<ResumeProfileNullableScalarRelationFilter, ResumeProfileWhereInput> | null
  }

  export type ApplicationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrderInput | SortOrder
    resumeProfileId?: SortOrderInput | SortOrder
    company?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    resumeTexUrl?: SortOrderInput | SortOrder
    resumePdfUrl?: SortOrderInput | SortOrder
    coverTexUrl?: SortOrderInput | SortOrder
    coverPdfUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    job?: JobOrderByWithRelationInput
    resumeProfile?: ResumeProfileOrderByWithRelationInput
  }

  export type ApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_jobId?: ApplicationUserIdJobIdCompoundUniqueInput
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    userId?: UuidFilter<"Application"> | string
    jobId?: UuidNullableFilter<"Application"> | string | null
    resumeProfileId?: UuidNullableFilter<"Application"> | string | null
    company?: StringNullableFilter<"Application"> | string | null
    role?: StringNullableFilter<"Application"> | string | null
    resumeTexUrl?: StringNullableFilter<"Application"> | string | null
    resumePdfUrl?: StringNullableFilter<"Application"> | string | null
    coverTexUrl?: StringNullableFilter<"Application"> | string | null
    coverPdfUrl?: StringNullableFilter<"Application"> | string | null
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    job?: XOR<JobNullableScalarRelationFilter, JobWhereInput> | null
    resumeProfile?: XOR<ResumeProfileNullableScalarRelationFilter, ResumeProfileWhereInput> | null
  }, "id" | "userId_jobId">

  export type ApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrderInput | SortOrder
    resumeProfileId?: SortOrderInput | SortOrder
    company?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    resumeTexUrl?: SortOrderInput | SortOrder
    resumePdfUrl?: SortOrderInput | SortOrder
    coverTexUrl?: SortOrderInput | SortOrder
    coverPdfUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ApplicationCountOrderByAggregateInput
    _max?: ApplicationMaxOrderByAggregateInput
    _min?: ApplicationMinOrderByAggregateInput
  }

  export type ApplicationScalarWhereWithAggregatesInput = {
    AND?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    OR?: ApplicationScalarWhereWithAggregatesInput[]
    NOT?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Application"> | string
    userId?: UuidWithAggregatesFilter<"Application"> | string
    jobId?: UuidNullableWithAggregatesFilter<"Application"> | string | null
    resumeProfileId?: UuidNullableWithAggregatesFilter<"Application"> | string | null
    company?: StringNullableWithAggregatesFilter<"Application"> | string | null
    role?: StringNullableWithAggregatesFilter<"Application"> | string | null
    resumeTexUrl?: StringNullableWithAggregatesFilter<"Application"> | string | null
    resumePdfUrl?: StringNullableWithAggregatesFilter<"Application"> | string | null
    coverTexUrl?: StringNullableWithAggregatesFilter<"Application"> | string | null
    coverPdfUrl?: StringNullableWithAggregatesFilter<"Application"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Application"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Application"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobCreateInput = {
    id?: string
    jobUrl: string
    title: string
    company?: string | null
    location?: string | null
    jobType?: string | null
    jobLevel?: string | null
    description?: string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutJobsInput
    applications?: ApplicationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateInput = {
    id?: string
    userId: string
    jobUrl: string
    title: string
    company?: string | null
    location?: string | null
    jobType?: string | null
    jobLevel?: string | null
    description?: string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    jobLevel?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutJobsNestedInput
    applications?: ApplicationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    jobLevel?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobCreateManyInput = {
    id?: string
    userId: string
    jobUrl: string
    title: string
    company?: string | null
    location?: string | null
    jobType?: string | null
    jobLevel?: string | null
    description?: string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    jobLevel?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    jobLevel?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeletedJobUrlCreateInput = {
    id?: string
    jobUrl: string
    deletedAt?: Date | string
    user: UserCreateNestedOneWithoutDeletedJobUrlsInput
  }

  export type DeletedJobUrlUncheckedCreateInput = {
    id?: string
    userId: string
    jobUrl: string
    deletedAt?: Date | string
  }

  export type DeletedJobUrlUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDeletedJobUrlsNestedInput
  }

  export type DeletedJobUrlUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeletedJobUrlCreateManyInput = {
    id?: string
    userId: string
    jobUrl: string
    deletedAt?: Date | string
  }

  export type DeletedJobUrlUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeletedJobUrlUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyCheckinCreateInput = {
    id?: string
    localDate: string
    checkedAt?: Date | string
    user: UserCreateNestedOneWithoutDailyCheckinsInput
  }

  export type DailyCheckinUncheckedCreateInput = {
    id?: string
    userId: string
    localDate: string
    checkedAt?: Date | string
  }

  export type DailyCheckinUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    localDate?: StringFieldUpdateOperationsInput | string
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDailyCheckinsNestedInput
  }

  export type DailyCheckinUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    localDate?: StringFieldUpdateOperationsInput | string
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyCheckinCreateManyInput = {
    id?: string
    userId: string
    localDate: string
    checkedAt?: Date | string
  }

  export type DailyCheckinUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    localDate?: StringFieldUpdateOperationsInput | string
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyCheckinUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    localDate?: StringFieldUpdateOperationsInput | string
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedSearchCreateInput = {
    id?: string
    name: string
    query: string
    location?: string | null
    hoursOld?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSavedSearchesInput
  }

  export type SavedSearchUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    query: string
    location?: string | null
    hoursOld?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedSearchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedSearchesNestedInput
  }

  export type SavedSearchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedSearchCreateManyInput = {
    id?: string
    userId: string
    name: string
    query: string
    location?: string | null
    hoursOld?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedSearchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedSearchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FetchRunCreateInput = {
    id?: string
    userEmail: string
    status?: $Enums.FetchRunStatus
    error?: string | null
    importedCount?: number
    queries: JsonNullValueInput | InputJsonValue
    location?: string | null
    hoursOld?: number | null
    resultsWanted?: number | null
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutFetchRunsInput
  }

  export type FetchRunUncheckedCreateInput = {
    id?: string
    userId: string
    userEmail: string
    status?: $Enums.FetchRunStatus
    error?: string | null
    importedCount?: number
    queries: JsonNullValueInput | InputJsonValue
    location?: string | null
    hoursOld?: number | null
    resultsWanted?: number | null
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FetchRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumFetchRunStatusFieldUpdateOperationsInput | $Enums.FetchRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    importedCount?: IntFieldUpdateOperationsInput | number
    queries?: JsonNullValueInput | InputJsonValue
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    resultsWanted?: NullableIntFieldUpdateOperationsInput | number | null
    includeFromQueries?: BoolFieldUpdateOperationsInput | boolean
    filterDescription?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFetchRunsNestedInput
  }

  export type FetchRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumFetchRunStatusFieldUpdateOperationsInput | $Enums.FetchRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    importedCount?: IntFieldUpdateOperationsInput | number
    queries?: JsonNullValueInput | InputJsonValue
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    resultsWanted?: NullableIntFieldUpdateOperationsInput | number | null
    includeFromQueries?: BoolFieldUpdateOperationsInput | boolean
    filterDescription?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FetchRunCreateManyInput = {
    id?: string
    userId: string
    userEmail: string
    status?: $Enums.FetchRunStatus
    error?: string | null
    importedCount?: number
    queries: JsonNullValueInput | InputJsonValue
    location?: string | null
    hoursOld?: number | null
    resultsWanted?: number | null
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FetchRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumFetchRunStatusFieldUpdateOperationsInput | $Enums.FetchRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    importedCount?: IntFieldUpdateOperationsInput | number
    queries?: JsonNullValueInput | InputJsonValue
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    resultsWanted?: NullableIntFieldUpdateOperationsInput | number | null
    includeFromQueries?: BoolFieldUpdateOperationsInput | boolean
    filterDescription?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FetchRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumFetchRunStatusFieldUpdateOperationsInput | $Enums.FetchRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    importedCount?: IntFieldUpdateOperationsInput | number
    queries?: JsonNullValueInput | InputJsonValue
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    resultsWanted?: NullableIntFieldUpdateOperationsInput | number | null
    includeFromQueries?: BoolFieldUpdateOperationsInput | boolean
    filterDescription?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeProfileCreateInput = {
    id?: string
    summary?: string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutResumeProfilesInput
    applications?: ApplicationCreateNestedManyWithoutResumeProfileInput
  }

  export type ResumeProfileUncheckedCreateInput = {
    id?: string
    userId: string
    summary?: string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutResumeProfileInput
  }

  export type ResumeProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutResumeProfilesNestedInput
    applications?: ApplicationUpdateManyWithoutResumeProfileNestedInput
  }

  export type ResumeProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutResumeProfileNestedInput
  }

  export type ResumeProfileCreateManyInput = {
    id?: string
    userId: string
    summary?: string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ResumeProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptProfileCreateInput = {
    id?: string
    cvRules: JsonNullValueInput | InputJsonValue
    coverRules: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAiPromptProfileInput
  }

  export type AiPromptProfileUncheckedCreateInput = {
    id?: string
    userId: string
    cvRules: JsonNullValueInput | InputJsonValue
    coverRules: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiPromptProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cvRules?: JsonNullValueInput | InputJsonValue
    coverRules?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAiPromptProfileNestedInput
  }

  export type AiPromptProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cvRules?: JsonNullValueInput | InputJsonValue
    coverRules?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptProfileCreateManyInput = {
    id?: string
    userId: string
    cvRules: JsonNullValueInput | InputJsonValue
    coverRules: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiPromptProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cvRules?: JsonNullValueInput | InputJsonValue
    coverRules?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cvRules?: JsonNullValueInput | InputJsonValue
    coverRules?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAiProviderConfigCreateInput = {
    id?: string
    provider: $Enums.AiProvider
    model?: string | null
    apiKeyCiphertext: string
    apiKeyIv: string
    apiKeyTag: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAiProviderConfigInput
  }

  export type UserAiProviderConfigUncheckedCreateInput = {
    id?: string
    userId: string
    provider: $Enums.AiProvider
    model?: string | null
    apiKeyCiphertext: string
    apiKeyIv: string
    apiKeyTag: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAiProviderConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAiProviderFieldUpdateOperationsInput | $Enums.AiProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyCiphertext?: StringFieldUpdateOperationsInput | string
    apiKeyIv?: StringFieldUpdateOperationsInput | string
    apiKeyTag?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAiProviderConfigNestedInput
  }

  export type UserAiProviderConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    provider?: EnumAiProviderFieldUpdateOperationsInput | $Enums.AiProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyCiphertext?: StringFieldUpdateOperationsInput | string
    apiKeyIv?: StringFieldUpdateOperationsInput | string
    apiKeyTag?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAiProviderConfigCreateManyInput = {
    id?: string
    userId: string
    provider: $Enums.AiProvider
    model?: string | null
    apiKeyCiphertext: string
    apiKeyIv: string
    apiKeyTag: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAiProviderConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAiProviderFieldUpdateOperationsInput | $Enums.AiProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyCiphertext?: StringFieldUpdateOperationsInput | string
    apiKeyIv?: StringFieldUpdateOperationsInput | string
    apiKeyTag?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAiProviderConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    provider?: EnumAiProviderFieldUpdateOperationsInput | $Enums.AiProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyCiphertext?: StringFieldUpdateOperationsInput | string
    apiKeyIv?: StringFieldUpdateOperationsInput | string
    apiKeyTag?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateInput = {
    id?: string
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
    job?: JobCreateNestedOneWithoutApplicationsInput
    resumeProfile?: ResumeProfileCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateInput = {
    id?: string
    userId: string
    jobId?: string | null
    resumeProfileId?: string | null
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
    job?: JobUpdateOneWithoutApplicationsNestedInput
    resumeProfile?: ResumeProfileUpdateOneWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    resumeProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateManyInput = {
    id?: string
    userId: string
    jobId?: string | null
    resumeProfileId?: string | null
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    resumeProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type JobListRelationFilter = {
    every?: JobWhereInput
    some?: JobWhereInput
    none?: JobWhereInput
  }

  export type SavedSearchListRelationFilter = {
    every?: SavedSearchWhereInput
    some?: SavedSearchWhereInput
    none?: SavedSearchWhereInput
  }

  export type FetchRunListRelationFilter = {
    every?: FetchRunWhereInput
    some?: FetchRunWhereInput
    none?: FetchRunWhereInput
  }

  export type DeletedJobUrlListRelationFilter = {
    every?: DeletedJobUrlWhereInput
    some?: DeletedJobUrlWhereInput
    none?: DeletedJobUrlWhereInput
  }

  export type DailyCheckinListRelationFilter = {
    every?: DailyCheckinWhereInput
    some?: DailyCheckinWhereInput
    none?: DailyCheckinWhereInput
  }

  export type ResumeProfileListRelationFilter = {
    every?: ResumeProfileWhereInput
    some?: ResumeProfileWhereInput
    none?: ResumeProfileWhereInput
  }

  export type AiPromptProfileNullableScalarRelationFilter = {
    is?: AiPromptProfileWhereInput | null
    isNot?: AiPromptProfileWhereInput | null
  }

  export type UserAiProviderConfigNullableScalarRelationFilter = {
    is?: UserAiProviderConfigWhereInput | null
    isNot?: UserAiProviderConfigWhereInput | null
  }

  export type ApplicationListRelationFilter = {
    every?: ApplicationWhereInput
    some?: ApplicationWhereInput
    none?: ApplicationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SavedSearchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FetchRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeletedJobUrlOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DailyCheckinOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ResumeProfileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    image?: SortOrder
    emailVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    image?: SortOrder
    emailVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    image?: SortOrder
    emailVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus
  }

  export type JobUserIdJobUrlCompoundUniqueInput = {
    userId: string
    jobUrl: string
  }

  export type JobCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    jobType?: SortOrder
    jobLevel?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    jobType?: SortOrder
    jobLevel?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    jobType?: SortOrder
    jobLevel?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobStatusFilter<$PrismaModel>
    _max?: NestedEnumJobStatusFilter<$PrismaModel>
  }

  export type DeletedJobUrlUserIdJobUrlCompoundUniqueInput = {
    userId: string
    jobUrl: string
  }

  export type DeletedJobUrlCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    deletedAt?: SortOrder
  }

  export type DeletedJobUrlMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    deletedAt?: SortOrder
  }

  export type DeletedJobUrlMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobUrl?: SortOrder
    deletedAt?: SortOrder
  }

  export type DailyCheckinUserIdLocalDateCompoundUniqueInput = {
    userId: string
    localDate: string
  }

  export type DailyCheckinCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    localDate?: SortOrder
    checkedAt?: SortOrder
  }

  export type DailyCheckinMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    localDate?: SortOrder
    checkedAt?: SortOrder
  }

  export type DailyCheckinMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    localDate?: SortOrder
    checkedAt?: SortOrder
  }

  export type SavedSearchCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    query?: SortOrder
    location?: SortOrder
    hoursOld?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SavedSearchAvgOrderByAggregateInput = {
    hoursOld?: SortOrder
  }

  export type SavedSearchMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    query?: SortOrder
    location?: SortOrder
    hoursOld?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SavedSearchMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    query?: SortOrder
    location?: SortOrder
    hoursOld?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SavedSearchSumOrderByAggregateInput = {
    hoursOld?: SortOrder
  }

  export type EnumFetchRunStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FetchRunStatus | EnumFetchRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FetchRunStatus[] | ListEnumFetchRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FetchRunStatus[] | ListEnumFetchRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFetchRunStatusFilter<$PrismaModel> | $Enums.FetchRunStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FetchRunCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    status?: SortOrder
    error?: SortOrder
    importedCount?: SortOrder
    queries?: SortOrder
    location?: SortOrder
    hoursOld?: SortOrder
    resultsWanted?: SortOrder
    includeFromQueries?: SortOrder
    filterDescription?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FetchRunAvgOrderByAggregateInput = {
    importedCount?: SortOrder
    hoursOld?: SortOrder
    resultsWanted?: SortOrder
  }

  export type FetchRunMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    status?: SortOrder
    error?: SortOrder
    importedCount?: SortOrder
    location?: SortOrder
    hoursOld?: SortOrder
    resultsWanted?: SortOrder
    includeFromQueries?: SortOrder
    filterDescription?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FetchRunMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    status?: SortOrder
    error?: SortOrder
    importedCount?: SortOrder
    location?: SortOrder
    hoursOld?: SortOrder
    resultsWanted?: SortOrder
    includeFromQueries?: SortOrder
    filterDescription?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FetchRunSumOrderByAggregateInput = {
    importedCount?: SortOrder
    hoursOld?: SortOrder
    resultsWanted?: SortOrder
  }

  export type EnumFetchRunStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FetchRunStatus | EnumFetchRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FetchRunStatus[] | ListEnumFetchRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FetchRunStatus[] | ListEnumFetchRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFetchRunStatusWithAggregatesFilter<$PrismaModel> | $Enums.FetchRunStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFetchRunStatusFilter<$PrismaModel>
    _max?: NestedEnumFetchRunStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ResumeProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    summary?: SortOrder
    basics?: SortOrder
    links?: SortOrder
    skills?: SortOrder
    experiences?: SortOrder
    projects?: SortOrder
    education?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type AiPromptProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    cvRules?: SortOrder
    coverRules?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiPromptProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiPromptProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAiProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AiProvider | EnumAiProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AiProvider[] | ListEnumAiProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AiProvider[] | ListEnumAiProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAiProviderFilter<$PrismaModel> | $Enums.AiProvider
  }

  export type UserAiProviderConfigCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    apiKeyCiphertext?: SortOrder
    apiKeyIv?: SortOrder
    apiKeyTag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAiProviderConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    apiKeyCiphertext?: SortOrder
    apiKeyIv?: SortOrder
    apiKeyTag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAiProviderConfigMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    apiKeyCiphertext?: SortOrder
    apiKeyIv?: SortOrder
    apiKeyTag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAiProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiProvider | EnumAiProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AiProvider[] | ListEnumAiProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AiProvider[] | ListEnumAiProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAiProviderWithAggregatesFilter<$PrismaModel> | $Enums.AiProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAiProviderFilter<$PrismaModel>
    _max?: NestedEnumAiProviderFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type JobNullableScalarRelationFilter = {
    is?: JobWhereInput | null
    isNot?: JobWhereInput | null
  }

  export type ResumeProfileNullableScalarRelationFilter = {
    is?: ResumeProfileWhereInput | null
    isNot?: ResumeProfileWhereInput | null
  }

  export type ApplicationUserIdJobIdCompoundUniqueInput = {
    userId: string
    jobId: string
  }

  export type ApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    resumeProfileId?: SortOrder
    company?: SortOrder
    role?: SortOrder
    resumeTexUrl?: SortOrder
    resumePdfUrl?: SortOrder
    coverTexUrl?: SortOrder
    coverPdfUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    resumeProfileId?: SortOrder
    company?: SortOrder
    role?: SortOrder
    resumeTexUrl?: SortOrder
    resumePdfUrl?: SortOrder
    coverTexUrl?: SortOrder
    coverPdfUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    resumeProfileId?: SortOrder
    company?: SortOrder
    role?: SortOrder
    resumeTexUrl?: SortOrder
    resumePdfUrl?: SortOrder
    coverTexUrl?: SortOrder
    coverPdfUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type JobCreateNestedManyWithoutUserInput = {
    create?: XOR<JobCreateWithoutUserInput, JobUncheckedCreateWithoutUserInput> | JobCreateWithoutUserInput[] | JobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobCreateOrConnectWithoutUserInput | JobCreateOrConnectWithoutUserInput[]
    createMany?: JobCreateManyUserInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type SavedSearchCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedSearchCreateWithoutUserInput, SavedSearchUncheckedCreateWithoutUserInput> | SavedSearchCreateWithoutUserInput[] | SavedSearchUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedSearchCreateOrConnectWithoutUserInput | SavedSearchCreateOrConnectWithoutUserInput[]
    createMany?: SavedSearchCreateManyUserInputEnvelope
    connect?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
  }

  export type FetchRunCreateNestedManyWithoutUserInput = {
    create?: XOR<FetchRunCreateWithoutUserInput, FetchRunUncheckedCreateWithoutUserInput> | FetchRunCreateWithoutUserInput[] | FetchRunUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FetchRunCreateOrConnectWithoutUserInput | FetchRunCreateOrConnectWithoutUserInput[]
    createMany?: FetchRunCreateManyUserInputEnvelope
    connect?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
  }

  export type DeletedJobUrlCreateNestedManyWithoutUserInput = {
    create?: XOR<DeletedJobUrlCreateWithoutUserInput, DeletedJobUrlUncheckedCreateWithoutUserInput> | DeletedJobUrlCreateWithoutUserInput[] | DeletedJobUrlUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeletedJobUrlCreateOrConnectWithoutUserInput | DeletedJobUrlCreateOrConnectWithoutUserInput[]
    createMany?: DeletedJobUrlCreateManyUserInputEnvelope
    connect?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
  }

  export type DailyCheckinCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyCheckinCreateWithoutUserInput, DailyCheckinUncheckedCreateWithoutUserInput> | DailyCheckinCreateWithoutUserInput[] | DailyCheckinUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyCheckinCreateOrConnectWithoutUserInput | DailyCheckinCreateOrConnectWithoutUserInput[]
    createMany?: DailyCheckinCreateManyUserInputEnvelope
    connect?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
  }

  export type ResumeProfileCreateNestedManyWithoutUserInput = {
    create?: XOR<ResumeProfileCreateWithoutUserInput, ResumeProfileUncheckedCreateWithoutUserInput> | ResumeProfileCreateWithoutUserInput[] | ResumeProfileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeProfileCreateOrConnectWithoutUserInput | ResumeProfileCreateOrConnectWithoutUserInput[]
    createMany?: ResumeProfileCreateManyUserInputEnvelope
    connect?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
  }

  export type AiPromptProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<AiPromptProfileCreateWithoutUserInput, AiPromptProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AiPromptProfileCreateOrConnectWithoutUserInput
    connect?: AiPromptProfileWhereUniqueInput
  }

  export type UserAiProviderConfigCreateNestedOneWithoutUserInput = {
    create?: XOR<UserAiProviderConfigCreateWithoutUserInput, UserAiProviderConfigUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserAiProviderConfigCreateOrConnectWithoutUserInput
    connect?: UserAiProviderConfigWhereUniqueInput
  }

  export type ApplicationCreateNestedManyWithoutUserInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type JobUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<JobCreateWithoutUserInput, JobUncheckedCreateWithoutUserInput> | JobCreateWithoutUserInput[] | JobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobCreateOrConnectWithoutUserInput | JobCreateOrConnectWithoutUserInput[]
    createMany?: JobCreateManyUserInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type SavedSearchUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedSearchCreateWithoutUserInput, SavedSearchUncheckedCreateWithoutUserInput> | SavedSearchCreateWithoutUserInput[] | SavedSearchUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedSearchCreateOrConnectWithoutUserInput | SavedSearchCreateOrConnectWithoutUserInput[]
    createMany?: SavedSearchCreateManyUserInputEnvelope
    connect?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
  }

  export type FetchRunUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FetchRunCreateWithoutUserInput, FetchRunUncheckedCreateWithoutUserInput> | FetchRunCreateWithoutUserInput[] | FetchRunUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FetchRunCreateOrConnectWithoutUserInput | FetchRunCreateOrConnectWithoutUserInput[]
    createMany?: FetchRunCreateManyUserInputEnvelope
    connect?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
  }

  export type DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DeletedJobUrlCreateWithoutUserInput, DeletedJobUrlUncheckedCreateWithoutUserInput> | DeletedJobUrlCreateWithoutUserInput[] | DeletedJobUrlUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeletedJobUrlCreateOrConnectWithoutUserInput | DeletedJobUrlCreateOrConnectWithoutUserInput[]
    createMany?: DeletedJobUrlCreateManyUserInputEnvelope
    connect?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
  }

  export type DailyCheckinUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyCheckinCreateWithoutUserInput, DailyCheckinUncheckedCreateWithoutUserInput> | DailyCheckinCreateWithoutUserInput[] | DailyCheckinUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyCheckinCreateOrConnectWithoutUserInput | DailyCheckinCreateOrConnectWithoutUserInput[]
    createMany?: DailyCheckinCreateManyUserInputEnvelope
    connect?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
  }

  export type ResumeProfileUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ResumeProfileCreateWithoutUserInput, ResumeProfileUncheckedCreateWithoutUserInput> | ResumeProfileCreateWithoutUserInput[] | ResumeProfileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeProfileCreateOrConnectWithoutUserInput | ResumeProfileCreateOrConnectWithoutUserInput[]
    createMany?: ResumeProfileCreateManyUserInputEnvelope
    connect?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
  }

  export type AiPromptProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<AiPromptProfileCreateWithoutUserInput, AiPromptProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AiPromptProfileCreateOrConnectWithoutUserInput
    connect?: AiPromptProfileWhereUniqueInput
  }

  export type UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserAiProviderConfigCreateWithoutUserInput, UserAiProviderConfigUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserAiProviderConfigCreateOrConnectWithoutUserInput
    connect?: UserAiProviderConfigWhereUniqueInput
  }

  export type ApplicationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type JobUpdateManyWithoutUserNestedInput = {
    create?: XOR<JobCreateWithoutUserInput, JobUncheckedCreateWithoutUserInput> | JobCreateWithoutUserInput[] | JobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobCreateOrConnectWithoutUserInput | JobCreateOrConnectWithoutUserInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutUserInput | JobUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JobCreateManyUserInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutUserInput | JobUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JobUpdateManyWithWhereWithoutUserInput | JobUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type SavedSearchUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedSearchCreateWithoutUserInput, SavedSearchUncheckedCreateWithoutUserInput> | SavedSearchCreateWithoutUserInput[] | SavedSearchUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedSearchCreateOrConnectWithoutUserInput | SavedSearchCreateOrConnectWithoutUserInput[]
    upsert?: SavedSearchUpsertWithWhereUniqueWithoutUserInput | SavedSearchUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedSearchCreateManyUserInputEnvelope
    set?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
    disconnect?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
    delete?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
    connect?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
    update?: SavedSearchUpdateWithWhereUniqueWithoutUserInput | SavedSearchUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedSearchUpdateManyWithWhereWithoutUserInput | SavedSearchUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedSearchScalarWhereInput | SavedSearchScalarWhereInput[]
  }

  export type FetchRunUpdateManyWithoutUserNestedInput = {
    create?: XOR<FetchRunCreateWithoutUserInput, FetchRunUncheckedCreateWithoutUserInput> | FetchRunCreateWithoutUserInput[] | FetchRunUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FetchRunCreateOrConnectWithoutUserInput | FetchRunCreateOrConnectWithoutUserInput[]
    upsert?: FetchRunUpsertWithWhereUniqueWithoutUserInput | FetchRunUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FetchRunCreateManyUserInputEnvelope
    set?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
    disconnect?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
    delete?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
    connect?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
    update?: FetchRunUpdateWithWhereUniqueWithoutUserInput | FetchRunUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FetchRunUpdateManyWithWhereWithoutUserInput | FetchRunUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FetchRunScalarWhereInput | FetchRunScalarWhereInput[]
  }

  export type DeletedJobUrlUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeletedJobUrlCreateWithoutUserInput, DeletedJobUrlUncheckedCreateWithoutUserInput> | DeletedJobUrlCreateWithoutUserInput[] | DeletedJobUrlUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeletedJobUrlCreateOrConnectWithoutUserInput | DeletedJobUrlCreateOrConnectWithoutUserInput[]
    upsert?: DeletedJobUrlUpsertWithWhereUniqueWithoutUserInput | DeletedJobUrlUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeletedJobUrlCreateManyUserInputEnvelope
    set?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
    disconnect?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
    delete?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
    connect?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
    update?: DeletedJobUrlUpdateWithWhereUniqueWithoutUserInput | DeletedJobUrlUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeletedJobUrlUpdateManyWithWhereWithoutUserInput | DeletedJobUrlUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeletedJobUrlScalarWhereInput | DeletedJobUrlScalarWhereInput[]
  }

  export type DailyCheckinUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyCheckinCreateWithoutUserInput, DailyCheckinUncheckedCreateWithoutUserInput> | DailyCheckinCreateWithoutUserInput[] | DailyCheckinUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyCheckinCreateOrConnectWithoutUserInput | DailyCheckinCreateOrConnectWithoutUserInput[]
    upsert?: DailyCheckinUpsertWithWhereUniqueWithoutUserInput | DailyCheckinUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyCheckinCreateManyUserInputEnvelope
    set?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
    disconnect?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
    delete?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
    connect?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
    update?: DailyCheckinUpdateWithWhereUniqueWithoutUserInput | DailyCheckinUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyCheckinUpdateManyWithWhereWithoutUserInput | DailyCheckinUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyCheckinScalarWhereInput | DailyCheckinScalarWhereInput[]
  }

  export type ResumeProfileUpdateManyWithoutUserNestedInput = {
    create?: XOR<ResumeProfileCreateWithoutUserInput, ResumeProfileUncheckedCreateWithoutUserInput> | ResumeProfileCreateWithoutUserInput[] | ResumeProfileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeProfileCreateOrConnectWithoutUserInput | ResumeProfileCreateOrConnectWithoutUserInput[]
    upsert?: ResumeProfileUpsertWithWhereUniqueWithoutUserInput | ResumeProfileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ResumeProfileCreateManyUserInputEnvelope
    set?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
    disconnect?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
    delete?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
    connect?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
    update?: ResumeProfileUpdateWithWhereUniqueWithoutUserInput | ResumeProfileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ResumeProfileUpdateManyWithWhereWithoutUserInput | ResumeProfileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ResumeProfileScalarWhereInput | ResumeProfileScalarWhereInput[]
  }

  export type AiPromptProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<AiPromptProfileCreateWithoutUserInput, AiPromptProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AiPromptProfileCreateOrConnectWithoutUserInput
    upsert?: AiPromptProfileUpsertWithoutUserInput
    disconnect?: AiPromptProfileWhereInput | boolean
    delete?: AiPromptProfileWhereInput | boolean
    connect?: AiPromptProfileWhereUniqueInput
    update?: XOR<XOR<AiPromptProfileUpdateToOneWithWhereWithoutUserInput, AiPromptProfileUpdateWithoutUserInput>, AiPromptProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserAiProviderConfigUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserAiProviderConfigCreateWithoutUserInput, UserAiProviderConfigUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserAiProviderConfigCreateOrConnectWithoutUserInput
    upsert?: UserAiProviderConfigUpsertWithoutUserInput
    disconnect?: UserAiProviderConfigWhereInput | boolean
    delete?: UserAiProviderConfigWhereInput | boolean
    connect?: UserAiProviderConfigWhereUniqueInput
    update?: XOR<XOR<UserAiProviderConfigUpdateToOneWithWhereWithoutUserInput, UserAiProviderConfigUpdateWithoutUserInput>, UserAiProviderConfigUncheckedUpdateWithoutUserInput>
  }

  export type ApplicationUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutUserInput | ApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutUserInput | ApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutUserInput | ApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type JobUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<JobCreateWithoutUserInput, JobUncheckedCreateWithoutUserInput> | JobCreateWithoutUserInput[] | JobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobCreateOrConnectWithoutUserInput | JobCreateOrConnectWithoutUserInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutUserInput | JobUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JobCreateManyUserInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutUserInput | JobUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JobUpdateManyWithWhereWithoutUserInput | JobUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type SavedSearchUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedSearchCreateWithoutUserInput, SavedSearchUncheckedCreateWithoutUserInput> | SavedSearchCreateWithoutUserInput[] | SavedSearchUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedSearchCreateOrConnectWithoutUserInput | SavedSearchCreateOrConnectWithoutUserInput[]
    upsert?: SavedSearchUpsertWithWhereUniqueWithoutUserInput | SavedSearchUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedSearchCreateManyUserInputEnvelope
    set?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
    disconnect?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
    delete?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
    connect?: SavedSearchWhereUniqueInput | SavedSearchWhereUniqueInput[]
    update?: SavedSearchUpdateWithWhereUniqueWithoutUserInput | SavedSearchUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedSearchUpdateManyWithWhereWithoutUserInput | SavedSearchUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedSearchScalarWhereInput | SavedSearchScalarWhereInput[]
  }

  export type FetchRunUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FetchRunCreateWithoutUserInput, FetchRunUncheckedCreateWithoutUserInput> | FetchRunCreateWithoutUserInput[] | FetchRunUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FetchRunCreateOrConnectWithoutUserInput | FetchRunCreateOrConnectWithoutUserInput[]
    upsert?: FetchRunUpsertWithWhereUniqueWithoutUserInput | FetchRunUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FetchRunCreateManyUserInputEnvelope
    set?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
    disconnect?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
    delete?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
    connect?: FetchRunWhereUniqueInput | FetchRunWhereUniqueInput[]
    update?: FetchRunUpdateWithWhereUniqueWithoutUserInput | FetchRunUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FetchRunUpdateManyWithWhereWithoutUserInput | FetchRunUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FetchRunScalarWhereInput | FetchRunScalarWhereInput[]
  }

  export type DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeletedJobUrlCreateWithoutUserInput, DeletedJobUrlUncheckedCreateWithoutUserInput> | DeletedJobUrlCreateWithoutUserInput[] | DeletedJobUrlUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeletedJobUrlCreateOrConnectWithoutUserInput | DeletedJobUrlCreateOrConnectWithoutUserInput[]
    upsert?: DeletedJobUrlUpsertWithWhereUniqueWithoutUserInput | DeletedJobUrlUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeletedJobUrlCreateManyUserInputEnvelope
    set?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
    disconnect?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
    delete?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
    connect?: DeletedJobUrlWhereUniqueInput | DeletedJobUrlWhereUniqueInput[]
    update?: DeletedJobUrlUpdateWithWhereUniqueWithoutUserInput | DeletedJobUrlUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeletedJobUrlUpdateManyWithWhereWithoutUserInput | DeletedJobUrlUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeletedJobUrlScalarWhereInput | DeletedJobUrlScalarWhereInput[]
  }

  export type DailyCheckinUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyCheckinCreateWithoutUserInput, DailyCheckinUncheckedCreateWithoutUserInput> | DailyCheckinCreateWithoutUserInput[] | DailyCheckinUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyCheckinCreateOrConnectWithoutUserInput | DailyCheckinCreateOrConnectWithoutUserInput[]
    upsert?: DailyCheckinUpsertWithWhereUniqueWithoutUserInput | DailyCheckinUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyCheckinCreateManyUserInputEnvelope
    set?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
    disconnect?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
    delete?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
    connect?: DailyCheckinWhereUniqueInput | DailyCheckinWhereUniqueInput[]
    update?: DailyCheckinUpdateWithWhereUniqueWithoutUserInput | DailyCheckinUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyCheckinUpdateManyWithWhereWithoutUserInput | DailyCheckinUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyCheckinScalarWhereInput | DailyCheckinScalarWhereInput[]
  }

  export type ResumeProfileUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ResumeProfileCreateWithoutUserInput, ResumeProfileUncheckedCreateWithoutUserInput> | ResumeProfileCreateWithoutUserInput[] | ResumeProfileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeProfileCreateOrConnectWithoutUserInput | ResumeProfileCreateOrConnectWithoutUserInput[]
    upsert?: ResumeProfileUpsertWithWhereUniqueWithoutUserInput | ResumeProfileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ResumeProfileCreateManyUserInputEnvelope
    set?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
    disconnect?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
    delete?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
    connect?: ResumeProfileWhereUniqueInput | ResumeProfileWhereUniqueInput[]
    update?: ResumeProfileUpdateWithWhereUniqueWithoutUserInput | ResumeProfileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ResumeProfileUpdateManyWithWhereWithoutUserInput | ResumeProfileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ResumeProfileScalarWhereInput | ResumeProfileScalarWhereInput[]
  }

  export type AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<AiPromptProfileCreateWithoutUserInput, AiPromptProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AiPromptProfileCreateOrConnectWithoutUserInput
    upsert?: AiPromptProfileUpsertWithoutUserInput
    disconnect?: AiPromptProfileWhereInput | boolean
    delete?: AiPromptProfileWhereInput | boolean
    connect?: AiPromptProfileWhereUniqueInput
    update?: XOR<XOR<AiPromptProfileUpdateToOneWithWhereWithoutUserInput, AiPromptProfileUpdateWithoutUserInput>, AiPromptProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserAiProviderConfigCreateWithoutUserInput, UserAiProviderConfigUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserAiProviderConfigCreateOrConnectWithoutUserInput
    upsert?: UserAiProviderConfigUpsertWithoutUserInput
    disconnect?: UserAiProviderConfigWhereInput | boolean
    delete?: UserAiProviderConfigWhereInput | boolean
    connect?: UserAiProviderConfigWhereUniqueInput
    update?: XOR<XOR<UserAiProviderConfigUpdateToOneWithWhereWithoutUserInput, UserAiProviderConfigUpdateWithoutUserInput>, UserAiProviderConfigUncheckedUpdateWithoutUserInput>
  }

  export type ApplicationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutUserInput | ApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutUserInput | ApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutUserInput | ApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutJobsInput = {
    create?: XOR<UserCreateWithoutJobsInput, UserUncheckedCreateWithoutJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutJobsInput
    connect?: UserWhereUniqueInput
  }

  export type ApplicationCreateNestedManyWithoutJobInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type EnumJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.JobStatus
  }

  export type UserUpdateOneRequiredWithoutJobsNestedInput = {
    create?: XOR<UserCreateWithoutJobsInput, UserUncheckedCreateWithoutJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutJobsInput
    upsert?: UserUpsertWithoutJobsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutJobsInput, UserUpdateWithoutJobsInput>, UserUncheckedUpdateWithoutJobsInput>
  }

  export type ApplicationUpdateManyWithoutJobNestedInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutJobInput | ApplicationUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutJobInput | ApplicationUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutJobInput | ApplicationUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutJobInput | ApplicationUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutJobInput | ApplicationUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutJobInput | ApplicationUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutDeletedJobUrlsInput = {
    create?: XOR<UserCreateWithoutDeletedJobUrlsInput, UserUncheckedCreateWithoutDeletedJobUrlsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDeletedJobUrlsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDeletedJobUrlsNestedInput = {
    create?: XOR<UserCreateWithoutDeletedJobUrlsInput, UserUncheckedCreateWithoutDeletedJobUrlsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDeletedJobUrlsInput
    upsert?: UserUpsertWithoutDeletedJobUrlsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDeletedJobUrlsInput, UserUpdateWithoutDeletedJobUrlsInput>, UserUncheckedUpdateWithoutDeletedJobUrlsInput>
  }

  export type UserCreateNestedOneWithoutDailyCheckinsInput = {
    create?: XOR<UserCreateWithoutDailyCheckinsInput, UserUncheckedCreateWithoutDailyCheckinsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDailyCheckinsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDailyCheckinsNestedInput = {
    create?: XOR<UserCreateWithoutDailyCheckinsInput, UserUncheckedCreateWithoutDailyCheckinsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDailyCheckinsInput
    upsert?: UserUpsertWithoutDailyCheckinsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDailyCheckinsInput, UserUpdateWithoutDailyCheckinsInput>, UserUncheckedUpdateWithoutDailyCheckinsInput>
  }

  export type UserCreateNestedOneWithoutSavedSearchesInput = {
    create?: XOR<UserCreateWithoutSavedSearchesInput, UserUncheckedCreateWithoutSavedSearchesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedSearchesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSavedSearchesNestedInput = {
    create?: XOR<UserCreateWithoutSavedSearchesInput, UserUncheckedCreateWithoutSavedSearchesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedSearchesInput
    upsert?: UserUpsertWithoutSavedSearchesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSavedSearchesInput, UserUpdateWithoutSavedSearchesInput>, UserUncheckedUpdateWithoutSavedSearchesInput>
  }

  export type UserCreateNestedOneWithoutFetchRunsInput = {
    create?: XOR<UserCreateWithoutFetchRunsInput, UserUncheckedCreateWithoutFetchRunsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFetchRunsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumFetchRunStatusFieldUpdateOperationsInput = {
    set?: $Enums.FetchRunStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutFetchRunsNestedInput = {
    create?: XOR<UserCreateWithoutFetchRunsInput, UserUncheckedCreateWithoutFetchRunsInput>
    connectOrCreate?: UserCreateOrConnectWithoutFetchRunsInput
    upsert?: UserUpsertWithoutFetchRunsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFetchRunsInput, UserUpdateWithoutFetchRunsInput>, UserUncheckedUpdateWithoutFetchRunsInput>
  }

  export type UserCreateNestedOneWithoutResumeProfilesInput = {
    create?: XOR<UserCreateWithoutResumeProfilesInput, UserUncheckedCreateWithoutResumeProfilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutResumeProfilesInput
    connect?: UserWhereUniqueInput
  }

  export type ApplicationCreateNestedManyWithoutResumeProfileInput = {
    create?: XOR<ApplicationCreateWithoutResumeProfileInput, ApplicationUncheckedCreateWithoutResumeProfileInput> | ApplicationCreateWithoutResumeProfileInput[] | ApplicationUncheckedCreateWithoutResumeProfileInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutResumeProfileInput | ApplicationCreateOrConnectWithoutResumeProfileInput[]
    createMany?: ApplicationCreateManyResumeProfileInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutResumeProfileInput = {
    create?: XOR<ApplicationCreateWithoutResumeProfileInput, ApplicationUncheckedCreateWithoutResumeProfileInput> | ApplicationCreateWithoutResumeProfileInput[] | ApplicationUncheckedCreateWithoutResumeProfileInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutResumeProfileInput | ApplicationCreateOrConnectWithoutResumeProfileInput[]
    createMany?: ApplicationCreateManyResumeProfileInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutResumeProfilesNestedInput = {
    create?: XOR<UserCreateWithoutResumeProfilesInput, UserUncheckedCreateWithoutResumeProfilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutResumeProfilesInput
    upsert?: UserUpsertWithoutResumeProfilesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutResumeProfilesInput, UserUpdateWithoutResumeProfilesInput>, UserUncheckedUpdateWithoutResumeProfilesInput>
  }

  export type ApplicationUpdateManyWithoutResumeProfileNestedInput = {
    create?: XOR<ApplicationCreateWithoutResumeProfileInput, ApplicationUncheckedCreateWithoutResumeProfileInput> | ApplicationCreateWithoutResumeProfileInput[] | ApplicationUncheckedCreateWithoutResumeProfileInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutResumeProfileInput | ApplicationCreateOrConnectWithoutResumeProfileInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutResumeProfileInput | ApplicationUpsertWithWhereUniqueWithoutResumeProfileInput[]
    createMany?: ApplicationCreateManyResumeProfileInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutResumeProfileInput | ApplicationUpdateWithWhereUniqueWithoutResumeProfileInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutResumeProfileInput | ApplicationUpdateManyWithWhereWithoutResumeProfileInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutResumeProfileNestedInput = {
    create?: XOR<ApplicationCreateWithoutResumeProfileInput, ApplicationUncheckedCreateWithoutResumeProfileInput> | ApplicationCreateWithoutResumeProfileInput[] | ApplicationUncheckedCreateWithoutResumeProfileInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutResumeProfileInput | ApplicationCreateOrConnectWithoutResumeProfileInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutResumeProfileInput | ApplicationUpsertWithWhereUniqueWithoutResumeProfileInput[]
    createMany?: ApplicationCreateManyResumeProfileInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutResumeProfileInput | ApplicationUpdateWithWhereUniqueWithoutResumeProfileInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutResumeProfileInput | ApplicationUpdateManyWithWhereWithoutResumeProfileInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAiPromptProfileInput = {
    create?: XOR<UserCreateWithoutAiPromptProfileInput, UserUncheckedCreateWithoutAiPromptProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutAiPromptProfileInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAiPromptProfileNestedInput = {
    create?: XOR<UserCreateWithoutAiPromptProfileInput, UserUncheckedCreateWithoutAiPromptProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutAiPromptProfileInput
    upsert?: UserUpsertWithoutAiPromptProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAiPromptProfileInput, UserUpdateWithoutAiPromptProfileInput>, UserUncheckedUpdateWithoutAiPromptProfileInput>
  }

  export type UserCreateNestedOneWithoutAiProviderConfigInput = {
    create?: XOR<UserCreateWithoutAiProviderConfigInput, UserUncheckedCreateWithoutAiProviderConfigInput>
    connectOrCreate?: UserCreateOrConnectWithoutAiProviderConfigInput
    connect?: UserWhereUniqueInput
  }

  export type EnumAiProviderFieldUpdateOperationsInput = {
    set?: $Enums.AiProvider
  }

  export type UserUpdateOneRequiredWithoutAiProviderConfigNestedInput = {
    create?: XOR<UserCreateWithoutAiProviderConfigInput, UserUncheckedCreateWithoutAiProviderConfigInput>
    connectOrCreate?: UserCreateOrConnectWithoutAiProviderConfigInput
    upsert?: UserUpsertWithoutAiProviderConfigInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAiProviderConfigInput, UserUpdateWithoutAiProviderConfigInput>, UserUncheckedUpdateWithoutAiProviderConfigInput>
  }

  export type UserCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput
    connect?: UserWhereUniqueInput
  }

  export type JobCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: JobCreateOrConnectWithoutApplicationsInput
    connect?: JobWhereUniqueInput
  }

  export type ResumeProfileCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<ResumeProfileCreateWithoutApplicationsInput, ResumeProfileUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: ResumeProfileCreateOrConnectWithoutApplicationsInput
    connect?: ResumeProfileWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput
    upsert?: UserUpsertWithoutApplicationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutApplicationsInput, UserUpdateWithoutApplicationsInput>, UserUncheckedUpdateWithoutApplicationsInput>
  }

  export type JobUpdateOneWithoutApplicationsNestedInput = {
    create?: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: JobCreateOrConnectWithoutApplicationsInput
    upsert?: JobUpsertWithoutApplicationsInput
    disconnect?: JobWhereInput | boolean
    delete?: JobWhereInput | boolean
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutApplicationsInput, JobUpdateWithoutApplicationsInput>, JobUncheckedUpdateWithoutApplicationsInput>
  }

  export type ResumeProfileUpdateOneWithoutApplicationsNestedInput = {
    create?: XOR<ResumeProfileCreateWithoutApplicationsInput, ResumeProfileUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: ResumeProfileCreateOrConnectWithoutApplicationsInput
    upsert?: ResumeProfileUpsertWithoutApplicationsInput
    disconnect?: ResumeProfileWhereInput | boolean
    delete?: ResumeProfileWhereInput | boolean
    connect?: ResumeProfileWhereUniqueInput
    update?: XOR<XOR<ResumeProfileUpdateToOneWithWhereWithoutApplicationsInput, ResumeProfileUpdateWithoutApplicationsInput>, ResumeProfileUncheckedUpdateWithoutApplicationsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus
  }

  export type NestedEnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobStatusFilter<$PrismaModel>
    _max?: NestedEnumJobStatusFilter<$PrismaModel>
  }

  export type NestedEnumFetchRunStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FetchRunStatus | EnumFetchRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FetchRunStatus[] | ListEnumFetchRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FetchRunStatus[] | ListEnumFetchRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFetchRunStatusFilter<$PrismaModel> | $Enums.FetchRunStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumFetchRunStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FetchRunStatus | EnumFetchRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FetchRunStatus[] | ListEnumFetchRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FetchRunStatus[] | ListEnumFetchRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFetchRunStatusWithAggregatesFilter<$PrismaModel> | $Enums.FetchRunStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFetchRunStatusFilter<$PrismaModel>
    _max?: NestedEnumFetchRunStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumAiProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AiProvider | EnumAiProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AiProvider[] | ListEnumAiProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AiProvider[] | ListEnumAiProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAiProviderFilter<$PrismaModel> | $Enums.AiProvider
  }

  export type NestedEnumAiProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiProvider | EnumAiProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AiProvider[] | ListEnumAiProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AiProvider[] | ListEnumAiProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAiProviderWithAggregatesFilter<$PrismaModel> | $Enums.AiProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAiProviderFilter<$PrismaModel>
    _max?: NestedEnumAiProviderFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type JobCreateWithoutUserInput = {
    id?: string
    jobUrl: string
    title: string
    company?: string | null
    location?: string | null
    jobType?: string | null
    jobLevel?: string | null
    description?: string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutUserInput = {
    id?: string
    jobUrl: string
    title: string
    company?: string | null
    location?: string | null
    jobType?: string | null
    jobLevel?: string | null
    description?: string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutUserInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutUserInput, JobUncheckedCreateWithoutUserInput>
  }

  export type JobCreateManyUserInputEnvelope = {
    data: JobCreateManyUserInput | JobCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SavedSearchCreateWithoutUserInput = {
    id?: string
    name: string
    query: string
    location?: string | null
    hoursOld?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedSearchUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    query: string
    location?: string | null
    hoursOld?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedSearchCreateOrConnectWithoutUserInput = {
    where: SavedSearchWhereUniqueInput
    create: XOR<SavedSearchCreateWithoutUserInput, SavedSearchUncheckedCreateWithoutUserInput>
  }

  export type SavedSearchCreateManyUserInputEnvelope = {
    data: SavedSearchCreateManyUserInput | SavedSearchCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FetchRunCreateWithoutUserInput = {
    id?: string
    userEmail: string
    status?: $Enums.FetchRunStatus
    error?: string | null
    importedCount?: number
    queries: JsonNullValueInput | InputJsonValue
    location?: string | null
    hoursOld?: number | null
    resultsWanted?: number | null
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FetchRunUncheckedCreateWithoutUserInput = {
    id?: string
    userEmail: string
    status?: $Enums.FetchRunStatus
    error?: string | null
    importedCount?: number
    queries: JsonNullValueInput | InputJsonValue
    location?: string | null
    hoursOld?: number | null
    resultsWanted?: number | null
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FetchRunCreateOrConnectWithoutUserInput = {
    where: FetchRunWhereUniqueInput
    create: XOR<FetchRunCreateWithoutUserInput, FetchRunUncheckedCreateWithoutUserInput>
  }

  export type FetchRunCreateManyUserInputEnvelope = {
    data: FetchRunCreateManyUserInput | FetchRunCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DeletedJobUrlCreateWithoutUserInput = {
    id?: string
    jobUrl: string
    deletedAt?: Date | string
  }

  export type DeletedJobUrlUncheckedCreateWithoutUserInput = {
    id?: string
    jobUrl: string
    deletedAt?: Date | string
  }

  export type DeletedJobUrlCreateOrConnectWithoutUserInput = {
    where: DeletedJobUrlWhereUniqueInput
    create: XOR<DeletedJobUrlCreateWithoutUserInput, DeletedJobUrlUncheckedCreateWithoutUserInput>
  }

  export type DeletedJobUrlCreateManyUserInputEnvelope = {
    data: DeletedJobUrlCreateManyUserInput | DeletedJobUrlCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DailyCheckinCreateWithoutUserInput = {
    id?: string
    localDate: string
    checkedAt?: Date | string
  }

  export type DailyCheckinUncheckedCreateWithoutUserInput = {
    id?: string
    localDate: string
    checkedAt?: Date | string
  }

  export type DailyCheckinCreateOrConnectWithoutUserInput = {
    where: DailyCheckinWhereUniqueInput
    create: XOR<DailyCheckinCreateWithoutUserInput, DailyCheckinUncheckedCreateWithoutUserInput>
  }

  export type DailyCheckinCreateManyUserInputEnvelope = {
    data: DailyCheckinCreateManyUserInput | DailyCheckinCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ResumeProfileCreateWithoutUserInput = {
    id?: string
    summary?: string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutResumeProfileInput
  }

  export type ResumeProfileUncheckedCreateWithoutUserInput = {
    id?: string
    summary?: string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutResumeProfileInput
  }

  export type ResumeProfileCreateOrConnectWithoutUserInput = {
    where: ResumeProfileWhereUniqueInput
    create: XOR<ResumeProfileCreateWithoutUserInput, ResumeProfileUncheckedCreateWithoutUserInput>
  }

  export type ResumeProfileCreateManyUserInputEnvelope = {
    data: ResumeProfileCreateManyUserInput | ResumeProfileCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AiPromptProfileCreateWithoutUserInput = {
    id?: string
    cvRules: JsonNullValueInput | InputJsonValue
    coverRules: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiPromptProfileUncheckedCreateWithoutUserInput = {
    id?: string
    cvRules: JsonNullValueInput | InputJsonValue
    coverRules: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiPromptProfileCreateOrConnectWithoutUserInput = {
    where: AiPromptProfileWhereUniqueInput
    create: XOR<AiPromptProfileCreateWithoutUserInput, AiPromptProfileUncheckedCreateWithoutUserInput>
  }

  export type UserAiProviderConfigCreateWithoutUserInput = {
    id?: string
    provider: $Enums.AiProvider
    model?: string | null
    apiKeyCiphertext: string
    apiKeyIv: string
    apiKeyTag: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAiProviderConfigUncheckedCreateWithoutUserInput = {
    id?: string
    provider: $Enums.AiProvider
    model?: string | null
    apiKeyCiphertext: string
    apiKeyIv: string
    apiKeyTag: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAiProviderConfigCreateOrConnectWithoutUserInput = {
    where: UserAiProviderConfigWhereUniqueInput
    create: XOR<UserAiProviderConfigCreateWithoutUserInput, UserAiProviderConfigUncheckedCreateWithoutUserInput>
  }

  export type ApplicationCreateWithoutUserInput = {
    id?: string
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    job?: JobCreateNestedOneWithoutApplicationsInput
    resumeProfile?: ResumeProfileCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutUserInput = {
    id?: string
    jobId?: string | null
    resumeProfileId?: string | null
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationCreateOrConnectWithoutUserInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput>
  }

  export type ApplicationCreateManyUserInputEnvelope = {
    data: ApplicationCreateManyUserInput | ApplicationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: UuidFilter<"Account"> | string
    userId?: UuidFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: UuidFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: UuidFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type JobUpsertWithWhereUniqueWithoutUserInput = {
    where: JobWhereUniqueInput
    update: XOR<JobUpdateWithoutUserInput, JobUncheckedUpdateWithoutUserInput>
    create: XOR<JobCreateWithoutUserInput, JobUncheckedCreateWithoutUserInput>
  }

  export type JobUpdateWithWhereUniqueWithoutUserInput = {
    where: JobWhereUniqueInput
    data: XOR<JobUpdateWithoutUserInput, JobUncheckedUpdateWithoutUserInput>
  }

  export type JobUpdateManyWithWhereWithoutUserInput = {
    where: JobScalarWhereInput
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyWithoutUserInput>
  }

  export type JobScalarWhereInput = {
    AND?: JobScalarWhereInput | JobScalarWhereInput[]
    OR?: JobScalarWhereInput[]
    NOT?: JobScalarWhereInput | JobScalarWhereInput[]
    id?: UuidFilter<"Job"> | string
    userId?: UuidFilter<"Job"> | string
    jobUrl?: StringFilter<"Job"> | string
    title?: StringFilter<"Job"> | string
    company?: StringNullableFilter<"Job"> | string | null
    location?: StringNullableFilter<"Job"> | string | null
    jobType?: StringNullableFilter<"Job"> | string | null
    jobLevel?: StringNullableFilter<"Job"> | string | null
    description?: StringNullableFilter<"Job"> | string | null
    status?: EnumJobStatusFilter<"Job"> | $Enums.JobStatus
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
  }

  export type SavedSearchUpsertWithWhereUniqueWithoutUserInput = {
    where: SavedSearchWhereUniqueInput
    update: XOR<SavedSearchUpdateWithoutUserInput, SavedSearchUncheckedUpdateWithoutUserInput>
    create: XOR<SavedSearchCreateWithoutUserInput, SavedSearchUncheckedCreateWithoutUserInput>
  }

  export type SavedSearchUpdateWithWhereUniqueWithoutUserInput = {
    where: SavedSearchWhereUniqueInput
    data: XOR<SavedSearchUpdateWithoutUserInput, SavedSearchUncheckedUpdateWithoutUserInput>
  }

  export type SavedSearchUpdateManyWithWhereWithoutUserInput = {
    where: SavedSearchScalarWhereInput
    data: XOR<SavedSearchUpdateManyMutationInput, SavedSearchUncheckedUpdateManyWithoutUserInput>
  }

  export type SavedSearchScalarWhereInput = {
    AND?: SavedSearchScalarWhereInput | SavedSearchScalarWhereInput[]
    OR?: SavedSearchScalarWhereInput[]
    NOT?: SavedSearchScalarWhereInput | SavedSearchScalarWhereInput[]
    id?: UuidFilter<"SavedSearch"> | string
    userId?: UuidFilter<"SavedSearch"> | string
    name?: StringFilter<"SavedSearch"> | string
    query?: StringFilter<"SavedSearch"> | string
    location?: StringNullableFilter<"SavedSearch"> | string | null
    hoursOld?: IntNullableFilter<"SavedSearch"> | number | null
    createdAt?: DateTimeFilter<"SavedSearch"> | Date | string
    updatedAt?: DateTimeFilter<"SavedSearch"> | Date | string
  }

  export type FetchRunUpsertWithWhereUniqueWithoutUserInput = {
    where: FetchRunWhereUniqueInput
    update: XOR<FetchRunUpdateWithoutUserInput, FetchRunUncheckedUpdateWithoutUserInput>
    create: XOR<FetchRunCreateWithoutUserInput, FetchRunUncheckedCreateWithoutUserInput>
  }

  export type FetchRunUpdateWithWhereUniqueWithoutUserInput = {
    where: FetchRunWhereUniqueInput
    data: XOR<FetchRunUpdateWithoutUserInput, FetchRunUncheckedUpdateWithoutUserInput>
  }

  export type FetchRunUpdateManyWithWhereWithoutUserInput = {
    where: FetchRunScalarWhereInput
    data: XOR<FetchRunUpdateManyMutationInput, FetchRunUncheckedUpdateManyWithoutUserInput>
  }

  export type FetchRunScalarWhereInput = {
    AND?: FetchRunScalarWhereInput | FetchRunScalarWhereInput[]
    OR?: FetchRunScalarWhereInput[]
    NOT?: FetchRunScalarWhereInput | FetchRunScalarWhereInput[]
    id?: UuidFilter<"FetchRun"> | string
    userId?: UuidFilter<"FetchRun"> | string
    userEmail?: StringFilter<"FetchRun"> | string
    status?: EnumFetchRunStatusFilter<"FetchRun"> | $Enums.FetchRunStatus
    error?: StringNullableFilter<"FetchRun"> | string | null
    importedCount?: IntFilter<"FetchRun"> | number
    queries?: JsonFilter<"FetchRun">
    location?: StringNullableFilter<"FetchRun"> | string | null
    hoursOld?: IntNullableFilter<"FetchRun"> | number | null
    resultsWanted?: IntNullableFilter<"FetchRun"> | number | null
    includeFromQueries?: BoolFilter<"FetchRun"> | boolean
    filterDescription?: BoolFilter<"FetchRun"> | boolean
    createdAt?: DateTimeFilter<"FetchRun"> | Date | string
    updatedAt?: DateTimeFilter<"FetchRun"> | Date | string
  }

  export type DeletedJobUrlUpsertWithWhereUniqueWithoutUserInput = {
    where: DeletedJobUrlWhereUniqueInput
    update: XOR<DeletedJobUrlUpdateWithoutUserInput, DeletedJobUrlUncheckedUpdateWithoutUserInput>
    create: XOR<DeletedJobUrlCreateWithoutUserInput, DeletedJobUrlUncheckedCreateWithoutUserInput>
  }

  export type DeletedJobUrlUpdateWithWhereUniqueWithoutUserInput = {
    where: DeletedJobUrlWhereUniqueInput
    data: XOR<DeletedJobUrlUpdateWithoutUserInput, DeletedJobUrlUncheckedUpdateWithoutUserInput>
  }

  export type DeletedJobUrlUpdateManyWithWhereWithoutUserInput = {
    where: DeletedJobUrlScalarWhereInput
    data: XOR<DeletedJobUrlUpdateManyMutationInput, DeletedJobUrlUncheckedUpdateManyWithoutUserInput>
  }

  export type DeletedJobUrlScalarWhereInput = {
    AND?: DeletedJobUrlScalarWhereInput | DeletedJobUrlScalarWhereInput[]
    OR?: DeletedJobUrlScalarWhereInput[]
    NOT?: DeletedJobUrlScalarWhereInput | DeletedJobUrlScalarWhereInput[]
    id?: UuidFilter<"DeletedJobUrl"> | string
    userId?: UuidFilter<"DeletedJobUrl"> | string
    jobUrl?: StringFilter<"DeletedJobUrl"> | string
    deletedAt?: DateTimeFilter<"DeletedJobUrl"> | Date | string
  }

  export type DailyCheckinUpsertWithWhereUniqueWithoutUserInput = {
    where: DailyCheckinWhereUniqueInput
    update: XOR<DailyCheckinUpdateWithoutUserInput, DailyCheckinUncheckedUpdateWithoutUserInput>
    create: XOR<DailyCheckinCreateWithoutUserInput, DailyCheckinUncheckedCreateWithoutUserInput>
  }

  export type DailyCheckinUpdateWithWhereUniqueWithoutUserInput = {
    where: DailyCheckinWhereUniqueInput
    data: XOR<DailyCheckinUpdateWithoutUserInput, DailyCheckinUncheckedUpdateWithoutUserInput>
  }

  export type DailyCheckinUpdateManyWithWhereWithoutUserInput = {
    where: DailyCheckinScalarWhereInput
    data: XOR<DailyCheckinUpdateManyMutationInput, DailyCheckinUncheckedUpdateManyWithoutUserInput>
  }

  export type DailyCheckinScalarWhereInput = {
    AND?: DailyCheckinScalarWhereInput | DailyCheckinScalarWhereInput[]
    OR?: DailyCheckinScalarWhereInput[]
    NOT?: DailyCheckinScalarWhereInput | DailyCheckinScalarWhereInput[]
    id?: UuidFilter<"DailyCheckin"> | string
    userId?: UuidFilter<"DailyCheckin"> | string
    localDate?: StringFilter<"DailyCheckin"> | string
    checkedAt?: DateTimeFilter<"DailyCheckin"> | Date | string
  }

  export type ResumeProfileUpsertWithWhereUniqueWithoutUserInput = {
    where: ResumeProfileWhereUniqueInput
    update: XOR<ResumeProfileUpdateWithoutUserInput, ResumeProfileUncheckedUpdateWithoutUserInput>
    create: XOR<ResumeProfileCreateWithoutUserInput, ResumeProfileUncheckedCreateWithoutUserInput>
  }

  export type ResumeProfileUpdateWithWhereUniqueWithoutUserInput = {
    where: ResumeProfileWhereUniqueInput
    data: XOR<ResumeProfileUpdateWithoutUserInput, ResumeProfileUncheckedUpdateWithoutUserInput>
  }

  export type ResumeProfileUpdateManyWithWhereWithoutUserInput = {
    where: ResumeProfileScalarWhereInput
    data: XOR<ResumeProfileUpdateManyMutationInput, ResumeProfileUncheckedUpdateManyWithoutUserInput>
  }

  export type ResumeProfileScalarWhereInput = {
    AND?: ResumeProfileScalarWhereInput | ResumeProfileScalarWhereInput[]
    OR?: ResumeProfileScalarWhereInput[]
    NOT?: ResumeProfileScalarWhereInput | ResumeProfileScalarWhereInput[]
    id?: UuidFilter<"ResumeProfile"> | string
    userId?: UuidFilter<"ResumeProfile"> | string
    summary?: StringNullableFilter<"ResumeProfile"> | string | null
    basics?: JsonNullableFilter<"ResumeProfile">
    links?: JsonNullableFilter<"ResumeProfile">
    skills?: JsonNullableFilter<"ResumeProfile">
    experiences?: JsonNullableFilter<"ResumeProfile">
    projects?: JsonNullableFilter<"ResumeProfile">
    education?: JsonNullableFilter<"ResumeProfile">
    createdAt?: DateTimeFilter<"ResumeProfile"> | Date | string
    updatedAt?: DateTimeFilter<"ResumeProfile"> | Date | string
  }

  export type AiPromptProfileUpsertWithoutUserInput = {
    update: XOR<AiPromptProfileUpdateWithoutUserInput, AiPromptProfileUncheckedUpdateWithoutUserInput>
    create: XOR<AiPromptProfileCreateWithoutUserInput, AiPromptProfileUncheckedCreateWithoutUserInput>
    where?: AiPromptProfileWhereInput
  }

  export type AiPromptProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: AiPromptProfileWhereInput
    data: XOR<AiPromptProfileUpdateWithoutUserInput, AiPromptProfileUncheckedUpdateWithoutUserInput>
  }

  export type AiPromptProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    cvRules?: JsonNullValueInput | InputJsonValue
    coverRules?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPromptProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    cvRules?: JsonNullValueInput | InputJsonValue
    coverRules?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAiProviderConfigUpsertWithoutUserInput = {
    update: XOR<UserAiProviderConfigUpdateWithoutUserInput, UserAiProviderConfigUncheckedUpdateWithoutUserInput>
    create: XOR<UserAiProviderConfigCreateWithoutUserInput, UserAiProviderConfigUncheckedCreateWithoutUserInput>
    where?: UserAiProviderConfigWhereInput
  }

  export type UserAiProviderConfigUpdateToOneWithWhereWithoutUserInput = {
    where?: UserAiProviderConfigWhereInput
    data: XOR<UserAiProviderConfigUpdateWithoutUserInput, UserAiProviderConfigUncheckedUpdateWithoutUserInput>
  }

  export type UserAiProviderConfigUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAiProviderFieldUpdateOperationsInput | $Enums.AiProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyCiphertext?: StringFieldUpdateOperationsInput | string
    apiKeyIv?: StringFieldUpdateOperationsInput | string
    apiKeyTag?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAiProviderConfigUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAiProviderFieldUpdateOperationsInput | $Enums.AiProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyCiphertext?: StringFieldUpdateOperationsInput | string
    apiKeyIv?: StringFieldUpdateOperationsInput | string
    apiKeyTag?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUpsertWithWhereUniqueWithoutUserInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutUserInput, ApplicationUncheckedUpdateWithoutUserInput>
    create: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutUserInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutUserInput, ApplicationUncheckedUpdateWithoutUserInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutUserInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutUserInput>
  }

  export type ApplicationScalarWhereInput = {
    AND?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    OR?: ApplicationScalarWhereInput[]
    NOT?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    id?: UuidFilter<"Application"> | string
    userId?: UuidFilter<"Application"> | string
    jobId?: UuidNullableFilter<"Application"> | string | null
    resumeProfileId?: UuidNullableFilter<"Application"> | string | null
    company?: StringNullableFilter<"Application"> | string | null
    role?: StringNullableFilter<"Application"> | string | null
    resumeTexUrl?: StringNullableFilter<"Application"> | string | null
    resumePdfUrl?: StringNullableFilter<"Application"> | string | null
    coverTexUrl?: StringNullableFilter<"Application"> | string | null
    coverPdfUrl?: StringNullableFilter<"Application"> | string | null
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutJobsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutJobsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutJobsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutJobsInput, UserUncheckedCreateWithoutJobsInput>
  }

  export type ApplicationCreateWithoutJobInput = {
    id?: string
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
    resumeProfile?: ResumeProfileCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutJobInput = {
    id?: string
    userId: string
    resumeProfileId?: string | null
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationCreateOrConnectWithoutJobInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput>
  }

  export type ApplicationCreateManyJobInputEnvelope = {
    data: ApplicationCreateManyJobInput | ApplicationCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutJobsInput = {
    update: XOR<UserUpdateWithoutJobsInput, UserUncheckedUpdateWithoutJobsInput>
    create: XOR<UserCreateWithoutJobsInput, UserUncheckedCreateWithoutJobsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutJobsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutJobsInput, UserUncheckedUpdateWithoutJobsInput>
  }

  export type UserUpdateWithoutJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ApplicationUpsertWithWhereUniqueWithoutJobInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutJobInput, ApplicationUncheckedUpdateWithoutJobInput>
    create: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutJobInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutJobInput, ApplicationUncheckedUpdateWithoutJobInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutJobInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutJobInput>
  }

  export type UserCreateWithoutDeletedJobUrlsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDeletedJobUrlsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDeletedJobUrlsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDeletedJobUrlsInput, UserUncheckedCreateWithoutDeletedJobUrlsInput>
  }

  export type UserUpsertWithoutDeletedJobUrlsInput = {
    update: XOR<UserUpdateWithoutDeletedJobUrlsInput, UserUncheckedUpdateWithoutDeletedJobUrlsInput>
    create: XOR<UserCreateWithoutDeletedJobUrlsInput, UserUncheckedCreateWithoutDeletedJobUrlsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDeletedJobUrlsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDeletedJobUrlsInput, UserUncheckedUpdateWithoutDeletedJobUrlsInput>
  }

  export type UserUpdateWithoutDeletedJobUrlsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDeletedJobUrlsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDailyCheckinsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDailyCheckinsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDailyCheckinsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDailyCheckinsInput, UserUncheckedCreateWithoutDailyCheckinsInput>
  }

  export type UserUpsertWithoutDailyCheckinsInput = {
    update: XOR<UserUpdateWithoutDailyCheckinsInput, UserUncheckedUpdateWithoutDailyCheckinsInput>
    create: XOR<UserCreateWithoutDailyCheckinsInput, UserUncheckedCreateWithoutDailyCheckinsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDailyCheckinsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDailyCheckinsInput, UserUncheckedUpdateWithoutDailyCheckinsInput>
  }

  export type UserUpdateWithoutDailyCheckinsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDailyCheckinsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSavedSearchesInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSavedSearchesInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSavedSearchesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSavedSearchesInput, UserUncheckedCreateWithoutSavedSearchesInput>
  }

  export type UserUpsertWithoutSavedSearchesInput = {
    update: XOR<UserUpdateWithoutSavedSearchesInput, UserUncheckedUpdateWithoutSavedSearchesInput>
    create: XOR<UserCreateWithoutSavedSearchesInput, UserUncheckedCreateWithoutSavedSearchesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSavedSearchesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSavedSearchesInput, UserUncheckedUpdateWithoutSavedSearchesInput>
  }

  export type UserUpdateWithoutSavedSearchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSavedSearchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutFetchRunsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFetchRunsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFetchRunsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFetchRunsInput, UserUncheckedCreateWithoutFetchRunsInput>
  }

  export type UserUpsertWithoutFetchRunsInput = {
    update: XOR<UserUpdateWithoutFetchRunsInput, UserUncheckedUpdateWithoutFetchRunsInput>
    create: XOR<UserCreateWithoutFetchRunsInput, UserUncheckedCreateWithoutFetchRunsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFetchRunsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFetchRunsInput, UserUncheckedUpdateWithoutFetchRunsInput>
  }

  export type UserUpdateWithoutFetchRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFetchRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutResumeProfilesInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutResumeProfilesInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutResumeProfilesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutResumeProfilesInput, UserUncheckedCreateWithoutResumeProfilesInput>
  }

  export type ApplicationCreateWithoutResumeProfileInput = {
    id?: string
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
    job?: JobCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutResumeProfileInput = {
    id?: string
    userId: string
    jobId?: string | null
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationCreateOrConnectWithoutResumeProfileInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutResumeProfileInput, ApplicationUncheckedCreateWithoutResumeProfileInput>
  }

  export type ApplicationCreateManyResumeProfileInputEnvelope = {
    data: ApplicationCreateManyResumeProfileInput | ApplicationCreateManyResumeProfileInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutResumeProfilesInput = {
    update: XOR<UserUpdateWithoutResumeProfilesInput, UserUncheckedUpdateWithoutResumeProfilesInput>
    create: XOR<UserCreateWithoutResumeProfilesInput, UserUncheckedCreateWithoutResumeProfilesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutResumeProfilesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutResumeProfilesInput, UserUncheckedUpdateWithoutResumeProfilesInput>
  }

  export type UserUpdateWithoutResumeProfilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutResumeProfilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ApplicationUpsertWithWhereUniqueWithoutResumeProfileInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutResumeProfileInput, ApplicationUncheckedUpdateWithoutResumeProfileInput>
    create: XOR<ApplicationCreateWithoutResumeProfileInput, ApplicationUncheckedCreateWithoutResumeProfileInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutResumeProfileInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutResumeProfileInput, ApplicationUncheckedUpdateWithoutResumeProfileInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutResumeProfileInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutResumeProfileInput>
  }

  export type UserCreateWithoutAiPromptProfileInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAiPromptProfileInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAiPromptProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAiPromptProfileInput, UserUncheckedCreateWithoutAiPromptProfileInput>
  }

  export type UserUpsertWithoutAiPromptProfileInput = {
    update: XOR<UserUpdateWithoutAiPromptProfileInput, UserUncheckedUpdateWithoutAiPromptProfileInput>
    create: XOR<UserCreateWithoutAiPromptProfileInput, UserUncheckedCreateWithoutAiPromptProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAiPromptProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAiPromptProfileInput, UserUncheckedUpdateWithoutAiPromptProfileInput>
  }

  export type UserUpdateWithoutAiPromptProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAiPromptProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAiProviderConfigInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAiProviderConfigInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAiProviderConfigInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAiProviderConfigInput, UserUncheckedCreateWithoutAiProviderConfigInput>
  }

  export type UserUpsertWithoutAiProviderConfigInput = {
    update: XOR<UserUpdateWithoutAiProviderConfigInput, UserUncheckedUpdateWithoutAiProviderConfigInput>
    create: XOR<UserCreateWithoutAiProviderConfigInput, UserUncheckedCreateWithoutAiProviderConfigInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAiProviderConfigInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAiProviderConfigInput, UserUncheckedUpdateWithoutAiProviderConfigInput>
  }

  export type UserUpdateWithoutAiProviderConfigInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAiProviderConfigInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutApplicationsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    jobs?: JobCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutApplicationsInput = {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
    emailVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    jobs?: JobUncheckedCreateNestedManyWithoutUserInput
    savedSearches?: SavedSearchUncheckedCreateNestedManyWithoutUserInput
    fetchRuns?: FetchRunUncheckedCreateNestedManyWithoutUserInput
    deletedJobUrls?: DeletedJobUrlUncheckedCreateNestedManyWithoutUserInput
    dailyCheckins?: DailyCheckinUncheckedCreateNestedManyWithoutUserInput
    resumeProfiles?: ResumeProfileUncheckedCreateNestedManyWithoutUserInput
    aiPromptProfile?: AiPromptProfileUncheckedCreateNestedOneWithoutUserInput
    aiProviderConfig?: UserAiProviderConfigUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutApplicationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
  }

  export type JobCreateWithoutApplicationsInput = {
    id?: string
    jobUrl: string
    title: string
    company?: string | null
    location?: string | null
    jobType?: string | null
    jobLevel?: string | null
    description?: string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutJobsInput
  }

  export type JobUncheckedCreateWithoutApplicationsInput = {
    id?: string
    userId: string
    jobUrl: string
    title: string
    company?: string | null
    location?: string | null
    jobType?: string | null
    jobLevel?: string | null
    description?: string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobCreateOrConnectWithoutApplicationsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
  }

  export type ResumeProfileCreateWithoutApplicationsInput = {
    id?: string
    summary?: string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutResumeProfilesInput
  }

  export type ResumeProfileUncheckedCreateWithoutApplicationsInput = {
    id?: string
    userId: string
    summary?: string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ResumeProfileCreateOrConnectWithoutApplicationsInput = {
    where: ResumeProfileWhereUniqueInput
    create: XOR<ResumeProfileCreateWithoutApplicationsInput, ResumeProfileUncheckedCreateWithoutApplicationsInput>
  }

  export type UserUpsertWithoutApplicationsInput = {
    update: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
  }

  export type UserUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    jobs?: JobUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    jobs?: JobUncheckedUpdateManyWithoutUserNestedInput
    savedSearches?: SavedSearchUncheckedUpdateManyWithoutUserNestedInput
    fetchRuns?: FetchRunUncheckedUpdateManyWithoutUserNestedInput
    deletedJobUrls?: DeletedJobUrlUncheckedUpdateManyWithoutUserNestedInput
    dailyCheckins?: DailyCheckinUncheckedUpdateManyWithoutUserNestedInput
    resumeProfiles?: ResumeProfileUncheckedUpdateManyWithoutUserNestedInput
    aiPromptProfile?: AiPromptProfileUncheckedUpdateOneWithoutUserNestedInput
    aiProviderConfig?: UserAiProviderConfigUncheckedUpdateOneWithoutUserNestedInput
  }

  export type JobUpsertWithoutApplicationsInput = {
    update: XOR<JobUpdateWithoutApplicationsInput, JobUncheckedUpdateWithoutApplicationsInput>
    create: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutApplicationsInput, JobUncheckedUpdateWithoutApplicationsInput>
  }

  export type JobUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    jobLevel?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutJobsNestedInput
  }

  export type JobUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    jobLevel?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeProfileUpsertWithoutApplicationsInput = {
    update: XOR<ResumeProfileUpdateWithoutApplicationsInput, ResumeProfileUncheckedUpdateWithoutApplicationsInput>
    create: XOR<ResumeProfileCreateWithoutApplicationsInput, ResumeProfileUncheckedCreateWithoutApplicationsInput>
    where?: ResumeProfileWhereInput
  }

  export type ResumeProfileUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: ResumeProfileWhereInput
    data: XOR<ResumeProfileUpdateWithoutApplicationsInput, ResumeProfileUncheckedUpdateWithoutApplicationsInput>
  }

  export type ResumeProfileUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutResumeProfilesNestedInput
  }

  export type ResumeProfileUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobCreateManyUserInput = {
    id?: string
    jobUrl: string
    title: string
    company?: string | null
    location?: string | null
    jobType?: string | null
    jobLevel?: string | null
    description?: string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedSearchCreateManyUserInput = {
    id?: string
    name: string
    query: string
    location?: string | null
    hoursOld?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FetchRunCreateManyUserInput = {
    id?: string
    userEmail: string
    status?: $Enums.FetchRunStatus
    error?: string | null
    importedCount?: number
    queries: JsonNullValueInput | InputJsonValue
    location?: string | null
    hoursOld?: number | null
    resultsWanted?: number | null
    includeFromQueries?: boolean
    filterDescription?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeletedJobUrlCreateManyUserInput = {
    id?: string
    jobUrl: string
    deletedAt?: Date | string
  }

  export type DailyCheckinCreateManyUserInput = {
    id?: string
    localDate: string
    checkedAt?: Date | string
  }

  export type ResumeProfileCreateManyUserInput = {
    id?: string
    summary?: string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationCreateManyUserInput = {
    id?: string
    jobId?: string | null
    resumeProfileId?: string | null
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    jobLevel?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    jobLevel?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    jobLevel?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedSearchUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedSearchUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedSearchUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FetchRunUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumFetchRunStatusFieldUpdateOperationsInput | $Enums.FetchRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    importedCount?: IntFieldUpdateOperationsInput | number
    queries?: JsonNullValueInput | InputJsonValue
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    resultsWanted?: NullableIntFieldUpdateOperationsInput | number | null
    includeFromQueries?: BoolFieldUpdateOperationsInput | boolean
    filterDescription?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FetchRunUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumFetchRunStatusFieldUpdateOperationsInput | $Enums.FetchRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    importedCount?: IntFieldUpdateOperationsInput | number
    queries?: JsonNullValueInput | InputJsonValue
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    resultsWanted?: NullableIntFieldUpdateOperationsInput | number | null
    includeFromQueries?: BoolFieldUpdateOperationsInput | boolean
    filterDescription?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FetchRunUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumFetchRunStatusFieldUpdateOperationsInput | $Enums.FetchRunStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    importedCount?: IntFieldUpdateOperationsInput | number
    queries?: JsonNullValueInput | InputJsonValue
    location?: NullableStringFieldUpdateOperationsInput | string | null
    hoursOld?: NullableIntFieldUpdateOperationsInput | number | null
    resultsWanted?: NullableIntFieldUpdateOperationsInput | number | null
    includeFromQueries?: BoolFieldUpdateOperationsInput | boolean
    filterDescription?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeletedJobUrlUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeletedJobUrlUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeletedJobUrlUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobUrl?: StringFieldUpdateOperationsInput | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyCheckinUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    localDate?: StringFieldUpdateOperationsInput | string
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyCheckinUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    localDate?: StringFieldUpdateOperationsInput | string
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyCheckinUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    localDate?: StringFieldUpdateOperationsInput | string
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutResumeProfileNestedInput
  }

  export type ResumeProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutResumeProfileNestedInput
  }

  export type ResumeProfileUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    basics?: NullableJsonNullValueInput | InputJsonValue
    links?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    experiences?: NullableJsonNullValueInput | InputJsonValue
    projects?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneWithoutApplicationsNestedInput
    resumeProfile?: ResumeProfileUpdateOneWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    resumeProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    resumeProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateManyJobInput = {
    id?: string
    userId: string
    resumeProfileId?: string | null
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
    resumeProfile?: ResumeProfileUpdateOneWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateManyWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateManyResumeProfileInput = {
    id?: string
    userId: string
    jobId?: string | null
    company?: string | null
    role?: string | null
    resumeTexUrl?: string | null
    resumePdfUrl?: string | null
    coverTexUrl?: string | null
    coverPdfUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationUpdateWithoutResumeProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
    job?: JobUpdateOneWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutResumeProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateManyWithoutResumeProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    resumeTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    resumePdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverTexUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverPdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}