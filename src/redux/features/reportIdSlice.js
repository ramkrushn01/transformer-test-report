import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportId: null, // Initial state
};

const reportSlice = createSlice({
  name: "reportId",
  initialState,
  reducers: {
    setReportId: (state, action) => {
      state.reportId = action.payload;
    },
    clearReportId: (state) => {
      state.reportId = null;
    },
  },
});

export const { setReportId, clearReportId } = reportSlice.actions;
export default reportSlice.reducer;
