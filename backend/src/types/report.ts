export interface ReportColumn<T extends object> {
  id: keyof T;
  title: string;

  /**
   * Width in PDF/Excel
   */
  width?: number;

  /**
   * Cell alignment
   */
  align?: "left" | "center" | "right";
}