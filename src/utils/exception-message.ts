export const getExceptionMessage = (type: number, message: string) => {
  switch (type) {
    case 404:
      return `${message} not found.`;
  }
};
