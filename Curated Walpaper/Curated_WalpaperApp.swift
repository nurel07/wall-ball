import SwiftUI
import AppKit
import Combine

// 1. DATA MODELS
// We ensure this is a plain struct outside of any class
struct WallpaperManifest: Codable {
    let id: String
    let imageUrl: String
    let title: String
}

// 2. THE LOGIC MANAGER
class WallpaperManager: ObservableObject {
    @Published var currentStatus: String = "Ready"
    @Published var currentTitle: String = "Waiting for update..."
    
    // REPLACE THIS URL WITH YOUR RAW GITHUB JSON URL
    let manifestUrl = URL(string: "https://raw.githubusercontent.com/nurel07/wall-ball/refs/heads/master/daily.json")!
    
    private let defaults = UserDefaults.standard
    
    func checkForUpdates() {
        DispatchQueue.main.async {
            self.currentStatus = "Checking for new wallpaper..."
        }
        
        let task = URLSession.shared.dataTask(with: manifestUrl) { data, response, error in
            if let error = error {
                DispatchQueue.main.async { self.currentStatus = "Error: \(error.localizedDescription)" }
                return
            }
            
            guard let data = data else { return }
            
            do {
                // Decode the data into our struct
                let manifest = try JSONDecoder().decode(WallpaperManifest.self, from: data)
                self.processManifest(manifest)
            } catch {
                DispatchQueue.main.async { self.currentStatus = "Data Error: \(error.localizedDescription)" }
            }
        }
        task.resume()
    }
    
    private func processManifest(_ manifest: WallpaperManifest) {
        DispatchQueue.main.async {
            self.currentTitle = manifest.title
        }
        
        let lastId = defaults.string(forKey: "lastWallpaperId")
        
        if lastId == manifest.id {
            DispatchQueue.main.async { self.currentStatus = "Up to date." }
            return
        }
        
        downloadImage(from: manifest.imageUrl, id: manifest.id)
    }
    
    private func downloadImage(from urlString: String, id: String) {
        guard let url = URL(string: urlString) else { return }
        
        DispatchQueue.main.async { self.currentStatus = "Downloading image..." }
        
        let task = URLSession.shared.downloadTask(with: url) { localURL, response, error in
            guard let localURL = localURL, error == nil else { return }
            
            do {
                let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
                let destinationURL = documentsURL.appendingPathComponent("current_wallpaper.jpg")
                
                if FileManager.default.fileExists(atPath: destinationURL.path) {
                    try FileManager.default.removeItem(at: destinationURL)
                }
                
                try FileManager.default.moveItem(at: localURL, to: destinationURL)
                self.setWallpaper(imageURL: destinationURL, id: id)
                
            } catch {
                print("File error: \(error)")
            }
        }
        task.resume()
    }
    
    private func setWallpaper(imageURL: URL, id: String) {
        DispatchQueue.main.async {
            do {
                let workspace = NSWorkspace.shared
                for screen in NSScreen.screens {
                    try workspace.setDesktopImageURL(imageURL, for: screen, options: [:])
                }
                self.defaults.set(id, forKey: "lastWallpaperId")
                self.currentStatus = "Wallpaper updated!"
            } catch {
                self.currentStatus = "Failed to set wallpaper."
            }
        }
    }
}

// 3. THE APP ENTRY POINT
@main
struct CuratedWallpaperApp: App {
    @StateObject var manager = WallpaperManager()
    
    // Timer fires every 1 hour (3600 seconds)
    let timer = Timer.publish(every: 3600, on: .main, in: .common).autoconnect()
    
    var body: some Scene {
        MenuBarExtra("Curated", systemImage: "photo.on.rectangle") {
            
            // --- VIEW CONTENT STARTS HERE ---
            VStack(alignment: .leading) {
                Text("Curated Wallpaper")
                    .font(.headline)
                Divider()
                Text("Current: \(manager.currentTitle)")
                Text("Status: \(manager.currentStatus)")
                    .font(.caption)
                    .foregroundColor(.gray)
                Divider()
                Button("Check Now") {
                    manager.checkForUpdates()
                }
                Button("Quit") {
                    NSApplication.shared.terminate(nil)
                }
            }
            .padding()
            // FIX: We attached these modifiers to the VStack (View), not the MenuBarExtra (Scene)
            .onAppear {
                manager.checkForUpdates()
            }
            .onReceive(timer) { _ in
                manager.checkForUpdates()
            }
            // --- VIEW CONTENT ENDS HERE ---
            
        }
        .menuBarExtraStyle(.menu)
    }
}
