#lang forge/bsl

option verbose 2

abstract sig Position {}
one sig Near extends Position {}
one sig Far extends Position {}
abstract sig GWAnimal {}
sig Goat extends GWAnimal {}
sig Wolf extends GWAnimal {}

sig GWState {
    gwnext: lone GWState,
    gwshore: pfunc GWAnimal -> Position, -- where is every animal?
    gwboat: one Position -- where is the boat?
}

pred GWValidStates {
    // All states must assign a position to every animal and to the boat.
    all s: GWState, a: GWAnimal | {
        s.gwshore[a] = Near or s.gwshore[a] = Far
    }
    all s: GWState {
        s.gwboat = Near or s.gwboat = Far
    }
}

// each of the predicates below should ASSUME valid states
//  they should NOT ENFORCE valid states
// (the `run` command below will enforce it!)

pred GWinitState[s: GWState] {
    // The boat and all animals start on the near side
    s.gwboat = Near
    all a: GWAnimal | { s.gwshore[a] = Near }
}

pred GWfinalState[s: GWState] {
    // All animals and the boat must end on the far side
    s.gwboat = Far
    all a: GWAnimal | { s.gwshore[a] = Far }
}

pred GWcanTransition[pre: GWState, post: GWState] {
    // - the boat must move
    pre.gwboat != post.gwboat

    // - the boat can carry 1-2 animals (not zero!)
    let animals_with_boat = #{a: GWAnimal | pre.gwshore[a] = pre.gwboat} |
    let animals_left_behind = #{a: GWAnimal | post.gwshore[a] = pre.gwboat} |
    let animals_taken = subtract[animals_with_boat, animals_left_behind] |
      (animals_taken = 1 or animals_taken = 2)

    // - every other animal stays in the same place
    all a: GWAnimal | pre.gwshore[a] != pre.gwboat => pre.gwshore[a] = post.gwshore[a]
}

pred GWTransitionStates {
    some init, final: GWState {
        GWinitState[init]
        GWfinalState[final]

        // - must be no state before the init state
        no s: GWState { s.gwnext = init }
        // - must be no state after the final state
        no s: GWState { final.gwnext = s }

        // - every state must be reachable from the initial
        reachable[final, init, gwnext]

        // - all state transitions must be valid
        all pre: GWState | all post: pre.gwnext {  GWcanTransition[pre, post] }
    }
}

pred GWNeverEating {
    // Never have goats outnumbered by wolves on either side.
    all s: GWState {
      let num_near_wolfs = #{a: Wolf | s.gwshore[a] = Near} |
      let num_near_goats =  #{a: Goat | s.gwshore[a] = Near} |
        num_near_goats != 0 => num_near_goats >= num_near_wolfs
      let num_far_wolfs = #{a: Wolf | s.gwshore[a] = Far} |
      let num_far_goats = #{a: Goat | s.gwshore[a] = Far} |
        num_far_goats != 0 => num_far_goats >= num_far_wolfs
    }
}

run {
    GWValidStates
    GWTransitionStates
    GWNeverEating
} for exactly 12 GWState,
  exactly 6 GWAnimal,
  exactly 3 Goat,
  exactly 3 Wolf,
  5 Int
  for {gwnext is linear}
