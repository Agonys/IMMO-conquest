interface FormatTimeOptions {
  onlyTime?: boolean;
  onlyDate?: boolean;
  withTimestamp?: boolean;
  date?: string | Date;
}

export const getISOTime = (options?: FormatTimeOptions) => {
  const now = options?.date ? new Date(options.date) : new Date();
  if (isNaN(now.valueOf())) {
    console.error(options?.date);
    throw new Error('Invalid date provided into getISOTime');
  }

  if (options?.onlyTime && options?.onlyDate) {
    throw new Error('onlyTime and onlyDate cannot both be true');
  }

  const nowISO = now.toISOString();
  const [date, time] = nowISO.split('T');
  if (options?.onlyTime) {
    return options.withTimestamp ? time : time.split('.')[0];
  }

  return options?.onlyDate ? date : nowISO;
};
