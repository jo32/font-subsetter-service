/**
 * Autogenerated by Thrift Compiler (0.9.1)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
package com.xiaomi.mif2e.fontSubsetter;


import java.util.Map;
import java.util.HashMap;
import org.apache.thrift.TEnum;

public enum FileType implements org.apache.thrift.TEnum {
  TTF(0),
  WOFF(1),
  EOT(2);

  private final int value;

  private FileType(int value) {
    this.value = value;
  }

  /**
   * Get the integer value of this enum value, as defined in the Thrift IDL.
   */
  public int getValue() {
    return value;
  }

  /**
   * Find a the enum type by its integer value, as defined in the Thrift IDL.
   * @return null if the value is not found.
   */
  public static FileType findByValue(int value) { 
    switch (value) {
      case 0:
        return TTF;
      case 1:
        return WOFF;
      case 2:
        return EOT;
      default:
        return null;
    }
  }
}
