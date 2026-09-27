import { describe, it, expect } from "vitest";
import { parseArohDeepLink } from "@aroh/asdk";
import { MobileApp } from "../src/App";
import { ExploreScreen } from "../src/screens/ExploreScreen";
import { WalletScreen } from "../src/screens/WalletScreen";
import { AIPortalScreen } from "../src/screens/AIPortalScreen";
import { KeysScreen } from "../src/screens/KeysScreen";
import { PrivacyScreen } from "../src/screens/PrivacyScreen";

describe("@aroh/mobile Client Shell Suite", () => {
  describe("Component & Architecture Integrity", () => {
    it("should export MobileApp and all 5 primary mobile screens", () => {
      expect(typeof MobileApp).toBe("function");
      expect(typeof ExploreScreen).toBe("function");
      expect(typeof WalletScreen).toBe("function");
      expect(typeof AIPortalScreen).toBe("function");
      expect(typeof KeysScreen).toBe("function");
      expect(typeof PrivacyScreen).toBe("function");
    });
  });

  describe("Deep Link Route Routing Integration", () => {
    it("should correctly route aroh://wallet to the wallet screen", () => {
      const res = parseArohDeepLink("aroh://wallet");
      expect(res.isValid).toBe(true);
      expect(res.route).toBe("wallet");
    });

    it("should correctly route aroh://explore/spedex to product_detail with spokeId", () => {
      const res = parseArohDeepLink("aroh://explore/spedex");
      expect(res.isValid).toBe(true);
      expect(res.route).toBe("product_detail");
      expect(res.params.spokeId).toBe("spedex");
    });

    it("should correctly route aroh://receipt/rcpt_test_999 to receipt route", () => {
      const res = parseArohDeepLink("aroh://receipt/rcpt_test_999");
      expect(res.isValid).toBe(true);
      expect(res.route).toBe("receipt");
      expect(res.params.receiptId).toBe("rcpt_test_999");
    });

    it("should fallback safely on unknown scheme route to explore", () => {
      const res = parseArohDeepLink("aroh://unknown-spoke-route");
      expect(res.isValid).toBe(true);
      expect(res.route).toBe("explore");
    });
  });
});
