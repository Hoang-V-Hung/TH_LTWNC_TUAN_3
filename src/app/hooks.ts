import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed hooks chuẩn RTK + TS: toàn bộ component chỉ dùng 2 hook này,
// không import useDispatch/useSelector gốc từ 'react-redux'.
// Dùng .withTypes (react-redux v9) để giữ đầy đủ kiểu cho thunk/asyncThunk.
export const useAppDispatch: () => AppDispatch =
  useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector.withTypes<RootState>();
