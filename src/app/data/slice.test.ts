import axios from "axios";
import dataSlice, { initialState, fetchData } from "./slice";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("dataSlice", () => {
  describe("initial state", () => {
    it("should return the initial state", () => {
      expect(
        dataSlice(
          {
            data: { limit: 12, products: [], skip: 0, total: 0 },
            error: null,
            loading: false,
          },
          { type: "" }
        )
      ).toEqual(initialState);
    });
  });

  describe("fetchData thunk", () => {
    const mockData = {
      products: [{ id: 1, title: "Product 1" }],
      total: 100,
      skip: 0,
      limit: 12,
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle pending state", () => {
      const action = { type: fetchData.pending.type };
      const state = dataSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    it("should handle fulfilled state with category filter", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const thunkArg = { category: "electronics" };
      const dispatch = jest.fn();
      const getState = jest.fn();

      await fetchData(thunkArg)(dispatch, getState, undefined);

      // Verify axios call
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://dummyjson.com/products/category/electronics",
        { params: { limit: 12, skip: 0 } }
      );

      // Verify state update
      const action = dispatch.mock.calls[1][0];
      const state = dataSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        data: mockData,
      });
    });

    it("should handle fulfilled state with search query", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const thunkArg = { search: "phone" };
      await fetchData(thunkArg)(jest.fn(), jest.fn(), undefined);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://dummyjson.com/products/search",
        { params: { q: "phone", limit: 12, skip: 0 } }
      );
    });

    it("should handle fulfilled state with pagination", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const thunkArg = { skip: 12 };
      await fetchData(thunkArg)(jest.fn(), jest.fn(), undefined);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://dummyjson.com/products",
        { params: { limit: 12, skip: 12 } }
      );
    });

    it("should handle rejected state", async () => {
      const errorMessage = "Network Error";
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      await fetchData({})(dispatch, jest.fn(), undefined);

      const action = dispatch.mock.calls[1][0];
      const state = dataSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: "Network Error",
      });
    });

    it("should use default URL when no filters provided", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockData });

      await fetchData({})(jest.fn(), jest.fn(), undefined);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://dummyjson.com/products",
        { params: { limit: 12, skip: 0 } }
      );
    });
  });

  describe("extraReducers", () => {
    it("should set loading=true and error=null on pending", () => {
      const state = dataSlice(initialState, fetchData.pending);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    it("should set loading=false and update data on fulfilled", () => {
      const mockPayload = {
        products: [{ id: 1, title: "New Product" }],
        total: 50,
        skip: 0,
        limit: 12,
      };

      const state = dataSlice(
        initialState,
        fetchData.fulfilled(mockPayload, "", {})
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        data: mockPayload,
      });
    });

    it("should set loading=false and error on rejected", () => {
      const state = dataSlice(
        initialState,
        fetchData.rejected(new Error("API Error"), "", {})
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: "API Error",
      });
    });
  });
});
