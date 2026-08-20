import { DefaultNamingStrategy, NamingStrategyInterface } from "typeorm";

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(className: string, customName?: string): string {
    return customName ? customName : toSnakeCase(className);
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    const prefix = embeddedPrefixes.length ? toSnakeCase(embeddedPrefixes.join("_")) + "_" : "";
    return prefix + (customName ? customName : toSnakeCase(propertyName));
  }

  relationName(propertyName: string): string {
    return toSnakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return toSnakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string): string {
    return toSnakeCase(`${firstTableName}_${firstPropertyName.replace(/\./gi, "_")}_${secondTableName}`);
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return toSnakeCase(`${tableName}_${columnName || propertyName}`);
  }
}
