export interface ApiResponse<T> {
  result: {
    debug?: string;
    code: "Y" | "N";
    message: string;
  };
  contents: T;
}
