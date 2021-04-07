import { expect } from "chai";
import * as proto from "../../gcp/proto";

describe("proto", () => {
  describe("duration", () => {
    it("should convert from seconds to duration", () => {
      expect(proto.durationFromSeconds(1)).to.equal("1s");
      expect(proto.durationFromSeconds(0.5)).to.equal("0.5s");
    });

    it("should convert from duration to seconds", () => {
      expect(proto.secondsFromDuration("1s")).to.equal(1);
      expect(proto.secondsFromDuration("0.5s")).to.equal(0.5);
    });
  });

  describe("copyIfPresent", () => {
    interface DestType {
      foo?: string;
    }
    interface SrcType {
      foo?: string;
      bar?: string;
    }
    it("should copy present fields", () => {
      const dest: DestType = {};
      const src: SrcType = { foo: "baz" };
      proto.copyIfPresent(dest, src, "foo");
      expect(dest.foo).to.equal("baz");
    });

    it("should not copy missing fields", () => {
      const dest: DestType = {};
      const src: SrcType = {};
      proto.copyIfPresent(dest, src, "foo");
      expect("foo" in dest).to.be.false;
    });

    it("should support transformations", () => {
      const dest: DestType = {};
      const src: SrcType = { foo: "baz" };
      proto.copyIfPresent(dest, src, "foo", (str) => str + " transformed");
      expect(dest.foo).to.equal("baz transformed");
    });

    // Compile-time check for type safety net
    const dest: DestType = {};
    const src: SrcType = { bar: "baz" };
    // This line should fail to compile when uncommented
    // proto.copyIfPresent(dest, src, "baz");
  });

  describe("renameIfPresent", () => {
    interface DestType {
      destFoo?: string;
    }

    interface SrcType {
      srcFoo?: string;
      bar?: string;
    }

    it("should copy present fields", () => {
      const dest: DestType = {};
      const src: SrcType = { srcFoo: "baz" };
      proto.renameIfPresent(dest, src, "destFoo", "srcFoo");
      expect(dest.destFoo).to.equal("baz");
    });

    it("should not copy missing fields", () => {
      const dest: DestType = {};
      const src: SrcType = {};
      proto.renameIfPresent(dest, src, "destFoo", "srcFoo");
      expect("destFoo" in dest).to.be.false;
    });

    it("should support transformations", () => {
      const dest: DestType = {};
      const src: SrcType = { srcFoo: "baz" };
      proto.renameIfPresent(dest, src, "destFoo", "srcFoo", (str) => str + " transformed");
      expect(dest.destFoo).to.equal("baz transformed");
    });

    // Compile-time check for type safety net
    const dest: DestType = {};
    const src: SrcType = { bar: "baz" };
    // These line should fail to compile when uncommented
    // proto.renameIfPresent(dest, src, "destFoo", "srcccFoo");
    // proto.renameIfPresent(dest, src, "desFoo", "srcFoo");
  });
});
