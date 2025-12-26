import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../services/api_service.dart';

class CollectionsScreen extends ConsumerWidget {
  const CollectionsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final collectionsAsync = ref.watch(collectionsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Basalt Collections'),
      ),
      body: collectionsAsync.when(
        data: (collections) {
          if (collections.isEmpty) {
            return const Center(child: Text("No collections found"));
          }
          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 3 / 4,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: collections.length,
            itemBuilder: (context, index) {
              final collection = collections[index];
              return GestureDetector(
                onTap: () => context.go('/collection/${collection.id}'),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    image: DecorationImage(
                      image: CachedNetworkImageProvider(collection.coverImage),
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.8),
                        ],
                      ),
                    ),
                    padding: const EdgeInsets.all(12),
                    alignment: Alignment.bottomLeft,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          collection.name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        if (collection.wallpaperCount > 0)
                          Text(
                            "${collection.wallpaperCount} Wallpapers",
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 12,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}
