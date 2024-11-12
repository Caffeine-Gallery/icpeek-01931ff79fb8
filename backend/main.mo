import Float "mo:base/Float";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import Debug "mo:base/Debug";

actor {
    // Define price data structure
    type PriceData = {
        timestamp: Int;
        price: Float;
    };

    // Store historical price data
    stable var priceHistory : [PriceData] = [];
    let buffer = Buffer.Buffer<PriceData>(100);

    // Initialize buffer with stable data
    public func init() : async () {
        for (entry in priceHistory.vals()) {
            buffer.add(entry);
        };
    };

    // Add new price data
    public shared func addPriceData(price: Float) : async () {
        let timestamp = Time.now();
        buffer.add({
            timestamp;
            price;
        });
        
        // Keep only last 100 entries
        if (buffer.size() > 100) {
            let _ = buffer.removeLast();
        };
        
        // Update stable storage
        priceHistory := Buffer.toArray(buffer);
    };

    // Get historical price data
    public query func getPriceHistory() : async [PriceData] {
        Buffer.toArray(buffer)
    };

    // System functions for upgrades
    system func preupgrade() {
        priceHistory := Buffer.toArray(buffer);
    };

    system func postupgrade() {
        for (entry in priceHistory.vals()) {
            buffer.add(entry);
        };
    };
}
